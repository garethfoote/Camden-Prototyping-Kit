# Export content and a journey diagram

The branching equipment example uses a separate view file for each page. Its export scenarios exercise eligibility, collection/delivery, conditional contact fields, invalid answers, and the additional route for a gazebo requested for use in a Camden park.

```sh
node scripts/generate-content-spec.js --journey event-equipment --strict
```

Each run creates a Markdown content specification, an SVG journey diagram and a JSON record in `content-specs`. They share a revision, timestamp and source fingerprint. SVG text stays sharp when zoomed or imported into a design board. Use `--format both` to include CSV; Markdown preserves conditional relationships better. The diagram omits Change links for readability; the document and JSON retain them. Repeated entries are screen states, not separate page files.

## Add scenarios to a new journey

Create `scripts/export-scenarios/<journey>.js`, exporting an array of objects. Keep page copy and routing in the views and routes. Scenarios provide only fictional answers, labels describing the conditions, and expected outcomes:

```js
module.exports = [{
  path: '/my-journey/eligibility',
  data: {},
  label: 'Eligibility question',
  submissions: [
    { body: {}, label: 'No answer', status: 422 },
    { body: { eligible: 'No' }, label: 'Not eligible', expected: '/my-journey/not-eligible' }
  ]
}]
```

Include every page and every important server-rendered variant. Supply session data that makes guarded pages reachable. Cover each branch, conditional validation, malformed as well as missing answers, and summaries. Use `kind: 'change'` for return-to-summary actions. A scenario for an expected GET redirect uses `expectedRedirect` and does not create a screen.

The exporter executes the project's synchronous route callbacks using isolated synthetic sessions. It captures their actual rendered templates, supplied locals, redirects and validation errors. This supports helper functions as well as direct renders. It does not start the server, contact services, use real user data, or replace browser tests. The harness supports this kit's simple routes; middleware-dependent, asynchronous, wildcard or external-integration routes need an appropriate adapter or HTTP test instead.

Unexercised GET/POST routes, unrendered page templates, unresolved internal destinations and unexpected outcomes are detected. An incomplete export exits with code 2 under `--strict`; an unexpected scenario result fails with code 1. Conditional combinations not included in scenarios cannot be guaranteed: zero warnings means the declared inventory and scenarios passed, not universal coverage.

For an older journey without scenarios, the existing static extraction still works, but marks conditional content and diagram coverage unverified. Parameterised/shared templates are explicitly flagged. Copy both `scripts/generate-content-spec.js` and `scripts/lib/journey-export.js` if transferring the exporter to another kit; it is no longer a single-file script.

## Verification

```sh
npm run build
node --test tests/journey-export.test.js
```

The tests check real content and behaviour: conditional email errors, branch answer cleanup, guarded routes, missed pages, unexpected transitions, SVG escaping, matching output revisions, and compatibility with the older permit/complaints examples. Also review the example in the browser, particularly its conditional reveals and error summary.
