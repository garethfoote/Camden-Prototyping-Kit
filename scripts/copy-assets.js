const fs = require('node:fs')
const path = require('node:path')

const root = path.join(__dirname, '..')
const camdenRoot = path.join(root, 'node_modules/lbcamden-frontend')
const camdenPackage = require(path.join(camdenRoot, 'package.json'))
const camdenDistName = `lbcamden-frontend-${camdenPackage.version}.min`

const copies = [
  {
    from: path.join(camdenRoot, 'lbcamden/assets'),
    to: path.join(root, 'public/assets')
  },
  {
    from: path.join(camdenRoot, `dist/${camdenDistName}.css`),
    to: path.join(root, 'public/stylesheets/lbcamden-frontend.min.css')
  },
  {
    from: path.join(camdenRoot, `dist/${camdenDistName}.js`),
    to: path.join(root, 'public/javascripts/lbcamden-frontend.min.js')
  },
  {
    from: path.join(camdenRoot, `dist/${camdenDistName}.js.map`),
    to: path.join(root, `public/javascripts/${camdenDistName}.js.map`)
  }
]

for (const directory of [
  path.join(root, 'public/assets'),
  path.join(root, 'public/stylesheets/node_modules'),
  path.join(root, 'public/javascripts/node_modules')
]) {
  fs.rmSync(directory, { force: true, recursive: true })
}

for (const staleAsset of [
  path.join(root, 'public/stylesheets/lbcamden-frontend-*.min.css'),
  path.join(root, 'public/javascripts/lbcamden-frontend-*.min.js'),
  path.join(root, 'public/javascripts/lbcamden-frontend-*.min.js.map')
]) {
  const directory = path.dirname(staleAsset)
  const pattern = new RegExp(`^${path.basename(staleAsset).replace(/\./g, '\\.').replace(/\*/g, '.*')}$`)

  for (const file of fs.readdirSync(directory)) {
    if (pattern.test(file)) {
      fs.rmSync(path.join(directory, file), { force: true })
    }
  }
}

for (const { from, to } of copies) {
  fs.mkdirSync(path.dirname(to), { recursive: true })
  fs.cpSync(from, to, { recursive: true })
}
