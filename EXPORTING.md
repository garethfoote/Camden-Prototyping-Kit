# Export content and a journey diagram

The branching equipment example uses a separate view file for each page. Its export scenarios exercise eligibility, collection/delivery, conditional contact fields, invalid answers, and the additional route for a gazebo requested for use in a Camden park.

```sh
node scripts/generate-content-spec.js --journey event-equipment --strict
```

Each run writes a Markdown content specification, an SVG journey diagram and a JSON record in `content-specs`, using stable `<journey>-content-spec-current` filenames. Before replacing them, it copies the previous export to filenames containing its original revision and generation date, for example `<journey>-content-spec-r001-2026-10-21T10-30-00Z.md`. Existing dated exports are retained and count towards the next revision. Commit the current files and archives together; review the current Markdown file in GitHub for content changes. The generation date and revision remain inside the current files. They share a revision, timestamp and source fingerprint. SVG text stays sharp when zoomed or imported into a design board. Use `--format both` to include CSV; Markdown preserves conditional relationships better. The diagram omits Change links for readability; the document and JSON retain them. Repeated entries are screen states, not separate page files.

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

## Exercise: reviewing content changes through to delivery

Recorded 21 October 2026 following discussion of the mental health front door prototype. These are questions to explore, not an agreed delivery policy.

Working hypothesis: while the prototype is actively being designed, designers change content in the prototype, regenerate the content specification and journey diagram, and include the source changes and exports in the same pull request. Developers review the generated Markdown changes in GitHub. Start with this workflow before building a separate content comparison interface.

The exporter now uses stable current filenames and archives the previous export with its revision and date. GitHub can compare successive versions of the current Markdown file. Keep generation metadata from overwhelming meaningful content changes, and check that an unchanged prototype produces no meaningful diff.

Try the workflow with a heading change, an option or hint change, a validation-message change, a conditional-content change and a removed page. Check that reviewers can identify the affected page, the old and new wording, and any changed journey behaviour. Check scenario coverage before treating an export as complete; exported content is limited by the states exercised.

Questions for designers and developers:

- While design and development overlap, which artefact is authoritative: the prototype, the generated specification, a separately maintained document, or the live implementation?
- Should every agreed content change be made in the prototype first? How are changes made during development reflected back, and who owns that work?
- Can the generated specification serve as the shared handoff document without being edited independently? If a separate editable document becomes authoritative, how will divergence be resolved?
- How do we distinguish proposed wording, approved wording and wording implemented in the service? Which reviewed revision is development using?
- Until when should the prototype match the intended live service? At launch, is it archived as a dated reference, maintained, or allowed to diverge under an explicit policy?
- Does GitHub's Markdown diff give designers and developers enough context, or is there evidence that a dedicated comparison interface is needed?

Useful outcome: agree ownership, the authoritative artefact at each stage, a repeatable review process and an explicit point at which prototype maintenance ends or changes purpose. Do not introduce two independently edited sources without deciding how they stay aligned.
