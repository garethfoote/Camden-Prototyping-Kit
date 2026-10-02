'use strict'
const fs = require('node:fs')
const path = require('node:path')
const crypto = require('node:crypto')

// Runs the project's own synchronous Express route callbacks, with isolated synthetic
// sessions. Deliberately not an HTTP/middleware emulator; unsupported handlers fail.
function invoke(router, method, url, data = {}, body = {}, sessionState = {}) {
  const parsed = new URL(url, 'http://prototype.invalid')
  const req = { method, path: parsed.pathname, url, originalUrl: url,
    query: Object.fromEntries(parsed.searchParams), params: {}, body: structuredClone(body),
    session: { ...structuredClone(sessionState), data: structuredClone(data) } }
  let result
  const res = { locals: { data: req.session.data }, statusCode: 200,
    status(code) { this.statusCode = code; return this },
    render(template, locals = {}) { result = { template, locals: { ...this.locals, ...locals }, status: this.statusCode }; return this },
    redirect(location) { result = { redirect: location, status: 302 }; return this }
  }
  for (const layer of router.stack) {
    const route = layer.route
    if (!route || !(route.methods[method.toLowerCase()] || route.methods._all)) continue
    if (typeof route.path !== 'string') throw new Error('Export requires string routes')
    const names = []
    const expression = route.path.split('/').map(segment => {
      if (segment.startsWith(':')) { names.push(segment.slice(1)); return '([^/]+)' }
      return segment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    }).join('/')
    const match = parsed.pathname.match(new RegExp(`^${expression}/?$`))
    if (!match) continue
    req.params = Object.fromEntries(names.map((name, i) => [name, decodeURIComponent(match[i + 1])]))
    for (const handler of route.stack) {
      let advanced = false
      const returned = handler.handle(req, res, error => { if (error) throw error; advanced = true })
      if (returned?.then) throw new Error('Async route requires a dedicated export adapter')
      if (result) return { ...result, data: req.session.data, session: req.session, routePattern: route.path }
      if (!advanced) throw new Error(`Route did not render or redirect: ${method} ${url}`)
    }
  }
  throw new Error(`No supported route: ${method} ${url}`)
}

function extractScenarios({ root, journey, scenarios, core, router = require(path.join(root, 'app/routes')), environment = core.createNunjucksEnvironment(root), canonicalize = value => value }) {
  const pages = new Map()
  const edges = []
  const warnings = []
  const visitedPatterns = new Set()
  const validations = []
  const routeSource = fs.readFileSync(path.join(root, 'app/routes.js'), 'utf8')
  const addEdge = (from, to, label, kind = 'forward') => {
    if (!to?.startsWith(`/${journey}/`)) return
    from = canonicalize(from)
    to = canonicalize(to.split('?')[0])
    if (!edges.some(e => e.from === from && e.to === to && e.label === label && e.kind === kind)) edges.push({ from, to, label, kind })
  }
  for (const scenario of scenarios) {
    const url = scenario.path
    const result = invoke(router, 'GET', url, scenario.data)
    visitedPatterns.add(`GET ${result.routePattern}`)
    if (result.redirect) {
      if (scenario.expectedRedirect !== result.redirect) throw new Error(`Unexpected GET redirect for ${url}: ${result.redirect}`)
      // Guard/action routes are transitions, not additional screens.
      if (scenario.from) addEdge(scenario.from, result.redirect, scenario.label, scenario.kind || 'repeat')
      continue
    }
    const template = result.template + (result.template.endsWith('.njk') ? '' : '.njk')
    const source = fs.readFileSync(path.join(root, 'app/views', template), 'utf8')
    const locals = { assetPath: '/assets', errors: {}, errorList: [], serviceName: journey,
      serviceHomeUrl: `/${journey}/start`, ...result.locals }
    const html = environment.render(template, locals)
    const page = core.extractPageFromHtml({ html, journey, root, source, template,
      route: { path: url.split('?')[0], line: 1, allRoutes: [] } })
    page.route = canonicalize(page.route)
    page.stateLabel = scenario.label || 'Default'
    page.validationCases = []
    page.nextRoutes = []
    page.warnings = page.warnings.filter(w => !(w.includes('no named form controls') && /<button/.test(html)))
    for (const submission of scenario.submissions || []) {
      const response = invoke(router, submission.method || 'POST', submission.path || url, result.data, submission.body, result.session)
      visitedPatterns.add(`${submission.method || 'POST'} ${response.routePattern}`)
      if (submission.status && response.status !== submission.status) throw new Error(`${url}: expected ${submission.status}, got ${response.status} (${submission.label})`)
      if (submission.expected && response.redirect !== submission.expected) throw new Error(`${url}: expected ${submission.expected}, got ${response.redirect || response.status} (${submission.label})`)
      if (response.status >= 400) {
        const errors = response.locals?.errors || {}
        if (!Object.keys(errors).length) warnings.push(`${url}: error response without extractable validation messages`)
        page.validationCases.push({ label: submission.label, errors })
        for (const question of page.questions) {
          if (errors[question.fieldName]) {
            question.validationMessages = [...new Set([...question.validationMessages, errors[question.fieldName]])]
            question.required = question.condition ? 'When shown (see validation cases)' : 'See validation cases'
          }
        }
        validations.push({ path: url, label: submission.label, status: response.status, errors })
      } else if (response.redirect) {
        addEdge(page.route, response.redirect, submission.label || 'Continue', submission.kind || 'forward')
        page.nextRoutes.push(response.redirect)
      } else warnings.push(`${url}: successful submission rendered instead of redirecting`)
    }
    // All internal forward links, including ordinary Add links, come from actual HTML.
    const document = core.parseHtml(html)
    const main = core.findFirst(document, node => node.tag === 'main') || document
    for (const a of core.findAll(main, node => node.tag === 'a' && node.attrs?.href)) {
      if ((a.attrs.class || '').includes('govuk-back-link')) continue
      const label = core.nodeText(a)
      const kind = /^Change/i.test(label) ? 'change' : /^(Add|Remove)/i.test(label) ? 'repeat' : 'forward'
      let destination = a.attrs.href
      if (destination.startsWith(`/${journey}/`) && /^(Remove)/i.test(label)) {
        const action = invoke(router, 'GET', destination, result.data)
        visitedPatterns.add(`GET ${action.routePattern}`)
        if (action.redirect) destination = action.redirect
      }
      addEdge(page.route, destination, label, kind)
    }
    const existing = pages.get(page.route)
    if (existing) {
      const signature = p => JSON.stringify([p.bodyContent, p.headings, p.summaryLists, p.questions.map(q => [q.fieldName, q.question, q.options, q.hint, q.condition, q.group])])
      const same = [existing, ...existing.variants].find(p => signature(p) === signature(page))
      if (same) {
        for (const item of page.validationCases) if (!same.validationCases.some(existing => JSON.stringify(existing) === JSON.stringify(item))) same.validationCases.push(item)
        same.exercisedStates = [...new Set([...(same.exercisedStates || []), page.stateLabel])]
        for (const question of same.questions) {
          const extra = page.questions.find(q => q.fieldName === question.fieldName)
          question.validationMessages = [...new Set([...question.validationMessages, ...(extra?.validationMessages || [])])]
          if (question.validationMessages.length) question.required = question.condition ? 'When shown (see validation cases)' : 'See validation cases'
        }
      } else existing.variants.push(page)
    }
    else { page.variants = []; pages.set(page.route, page) }
  }
  for (const layer of router.stack) {
    const route = layer.route
    if (!route || typeof route.path !== 'string' || !route.path.startsWith(`/${journey}/`)) continue
    for (const method of ['get', 'post']) {
      if (route.methods[method] && !visitedPatterns.has(`${method.toUpperCase()} ${route.path}`)) warnings.push(`No scenario exercises ${method.toUpperCase()} ${route.path}`)
    }
  }
  let index = 0
  for (const page of pages.values()) {
    page.order = ++index
    page.variants.forEach((variant, i) => { variant.order = `${index}.${i + 1}` })
    page.nextRoutes = [...new Set(edges.filter(e => e.from === page.route).map(e => e.to))]
    for (const state of [page, ...page.variants]) warnings.push(...state.warnings.map(w => `${page.route}: ${w}`))
  }
  const renderedTemplates = new Set([...pages.values()].flatMap(p => [p, ...p.variants]).map(p => p.template))
  for (const file of core.walkFiles(path.join(root, 'app/views', journey), '.njk')) {
    if (!path.basename(file).startsWith('_') && !renderedTemplates.has(`${journey}/${file}`)) warnings.push(`No scenario renders ${journey}/${file}`)
  }
  for (const edge of edges) if (!pages.has(edge.to)) warnings.push(`Unrendered destination: ${edge.to} (from ${edge.from})`)
  const hash = crypto.createHash('sha256').update(routeSource).update(JSON.stringify(scenarios))
  const files = core.walkFiles(path.join(root, 'app/views'), '.njk')
  files.forEach(file => hash.update(file).update(fs.readFileSync(path.join(root, 'app/views', file))))
  return { journey, pages: [...pages.values()], edges, validations, sourceHash: hash.digest('hex').slice(0, 12),
    coverage: 'Rendered scenario coverage; not an exhaustive proof of all possible answers. Sample values are fictional.', warnings: [...new Set(warnings)] }
}

const xml = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' }[c]))
function wrap(value, width = 34) {
  const lines = ['']
  for (const word of String(value).split(/\s+/)) {
    if ((lines.at(-1) + ' ' + word).length > width && lines.at(-1)) lines.push(word)
    else lines[lines.length - 1] += (lines.at(-1) ? ' ' : '') + word
  }
  return lines
}
function createSvg(spec) {
  // A left-to-right overview with one column per screen. Separate lanes keep
  // labelled branches/rejoins/loops legible even for long, cyclic journeys.
  const pages = spec.pages
  const positions = new Map(pages.map((p, i) => [p.route, i]))
  let edges = (spec.edges || pages.flatMap(p => p.nextRoutes.map(to => ({ from: p.route, to, label: 'Continue' })))).filter(e => positions.has(e.from) && positions.has(e.to) && e.kind !== 'change')
  edges = edges.filter((e, i) => edges.findIndex(other => other.from === e.from && other.to === e.to && other.kind === e.kind) === i).map(e => {
    const siblings = edges.filter(other => other.from === e.from && other.to === e.to && other.kind === e.kind)
    const destinations = new Set(edges.filter(other => other.from === e.from).map(other => other.to))
    let labels = [...new Set(siblings.map(item => item.diagramLabel || item.label))]
    if (labels.length > 1) labels = labels.filter(label => label !== 'Continue')
    return { ...e, label: destinations.size === 1 && siblings.length > 1 ? 'Continue' : labels.join(' / ') }
  })
  const nodeWidth = 260, gap = 110, nodeHeight = 160
  const lanes = []
  const laidEdges = edges.map(e => {
    const a = positions.get(e.from), b = positions.get(e.to)
    if (b === a + 1 && edges.filter(x => x.from === e.from && x.to === e.to).length === 1) return { ...e, a, b, lane: -1 }
    const lo = Math.min(a, b), hi = Math.max(a, b)
    let lane = lanes.findIndex(occupied => occupied.every(([l, h]) => hi < l || lo > h))
    if (lane === -1) { lane = lanes.length; lanes.push([]) }
    lanes[lane].push([lo, hi])
    return { ...e, a, b, lane }
  })
  const y = 210 + lanes.length * 58
  const width = Math.max(1000, pages.length * (nodeWidth + gap) + 80)
  const height = y + nodeHeight + 125
  const x = i => 40 + i * (nodeWidth + gap)
  const text = (label, tx, ty, cls = '', anchor = 'start') => `<text x="${tx}" y="${ty}" class="${cls}" text-anchor="${anchor}">${xml(label)}</text>`
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="title desc"><title id="title">${xml(spec.journeyName)} — journey</title><desc id="desc">${xml(spec.coverage || 'Static route extraction; branch labels may be unresolved.')} Change links are listed in the content document and JSON.</desc><defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10z" fill="#475569"/></marker></defs><style>text{font-family:Arial,sans-serif;fill:#172b4d;font-size:14px}.title{font-size:25px;font-weight:bold}.heading{font-size:16px;font-weight:bold}.small{font-size:12px}.edge{fill:none;stroke:#475569;stroke-width:1.5;marker-end:url(#arrow)}.label{paint-order:stroke;stroke:white;stroke-width:5px;stroke-linejoin:round}</style><rect width="100%" height="100%" fill="white"/>`
  svg += text(spec.journeyName + ' — prototype journey', 40, 42, 'title')
  svg += text(`${pages.length} screens · ${spec.revisionLabel} · ${spec.generatedAt} · ${spec.warnings.length} extraction warnings`, 40, 70)
  svg += text('Purple: question/content · Green: start/confirmation · Red: ineligible outcome · Dashed: repeat · Change links omitted for clarity', 40, 96)
  svg += text(spec.edges ? 'Scenario-verified routes; see content document for conditional states, validation and coverage limits.' : 'Unverified static extraction; computed branches and conditional states may be missing.', 40, 120)
  for (const e of laidEdges) {
    const fromX = x(e.a), toX = x(e.b)
    let d, lx, ly
    if (e.lane === -1) { d = `M${fromX + nodeWidth} ${y + 80} H${toX - 6}`; lx = fromX + nodeWidth + gap / 2; ly = y + 50 }
    else {
      const laneY = y - 45 - e.lane * 58
      const sx = fromX + nodeWidth * 0.7, tx = toX + nodeWidth * 0.3
      d = `M${sx} ${y} V${laneY} H${tx} V${y - 5}`
      lx = (sx + tx) / 2; ly = laneY - 8
    }
    svg += `<path class="edge" d="${d}"${(e.kind === 'repeat' || e.b <= e.a) ? ' stroke-dasharray="6 4"' : ''}><title>${xml(e.label)}</title></path>`
    wrap(e.label.length > 85 ? e.label.slice(0, 82) + '…' : e.label, e.lane === -1 ? 14 : 48).forEach((line, i) => { svg += text(line, lx, ly + i * 15, 'small label', 'middle') })
  }
  pages.forEach((p, i) => {
    const fill = /not-eligible/.test(p.route) ? '#ffe2df' : /start page|confirmation/.test(p.pageType) ? '#d5f5e3' : '#e9e3ff'
    svg += `<g><title>${xml(p.route)}</title><rect x="${x(i)}" y="${y}" width="${nodeWidth}" height="${nodeHeight}" rx="12" fill="${fill}" stroke="#827c99"/>`
    svg += text(`${p.order}. ${p.pageType}`, x(i) + 16, y + 24, 'small')
    wrap(p.primaryHeading || p.browserTitle, 29).forEach((line, j) => { svg += text(line, x(i) + 16, y + 50 + j * 20, 'heading') })
    svg += text(`${1 + (p.variants?.length || 0)} documented state(s)`, x(i) + 16, y + nodeHeight - 15, 'small') + '</g>'
  })
  svg += text('A screen can appear more than once during a journey. Validation redisplays the same screen; error cases are documented separately.', 40, height - 45)
  return svg + '</svg>\n'
}
module.exports = { invoke, extractScenarios, createSvg }
