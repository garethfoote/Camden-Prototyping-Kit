---
name: camden-prototyping
description: Create, revise, review, and prepare Camden transactional service prototypes in this repository. Use when a designer asks to turn a sketch into pages, create a service journey, add validation, add a conditional branch, create check answers or confirmation pages, revise copy, or check a prototype locally. Follow the existing Express, Nunjucks, Camden frontend, GOV.UK, and session-backed patterns.
---

# Camden prototyping workflow

Use this skill to help designers turn a service idea, journey map, sketch, or copy change into a reviewable Camden prototype.

## Before editing

1. Read `README.md` and inspect the relevant existing journey before changing files.
2. Read `PROMPTS.md` when the user wants examples or a more structured prompt.
3. Read `PUBLISHING.md` when the user asks about GitHub, Render, passwords, or sharing a deployed prototype.
4. Identify the closest existing pattern:
   - Use `app/views/permit` for a short, simple form journey.
   - Use `app/views/complaints` for a longer journey with branches or several form pages.
5. For a new journey, describe the proposed page sequence, branches, saved answers, and assumptions before implementing it. Ask only for information that is genuinely needed to proceed.

## Implementing a journey

Use the existing architecture:

- Add routes to `app/routes.js`.
- Add Nunjucks views under `app/views/<journey-name>`.
- Extend `layouts/main.njk`.
- Reuse `macros/forms.njk` for text inputs and error summaries.
- Use Camden frontend macros, GOV.UK classes, and the existing Storybook patterns.
- Store prototype answers in `req.session.data`.
- Read saved answers through the Nunjucks `data` object.

For each form page:

1. Add a GET route that renders the page.
2. Add a POST route that validates submitted fields.
3. Render the same page with an error summary and field errors when validation fails.
4. Preserve submitted values when the page is shown again.
5. Save valid answers to `req.session.data` and redirect to the next page.
6. Add a useful back link that follows the journey order.

For a complete transactional journey, include a start page, the necessary form pages, a check answers page, and a confirmation page. Add a Change link for every answer shown on the check answers page. Keep branches explicit and make sure the check answers page reflects the answers that determine the branch.

## Design and implementation rules

- Follow Camden frontend and GOV.UK patterns already present in the repository.
- Prefer existing macros, classes, spacing, buttons, labels, hints, error messages, summary lists, and confirmation patterns.
- Do not add a new framework, frontend library, custom component, custom button style, or custom spacing system when an existing pattern fits.
- Keep copy clear and service-specific, while preserving existing route names and data keys when revising a journey unless there is a good reason to change them.
- Keep implementation lightweight and easy for a designer to review in VS Code.
- Do not treat a prototype as a live service: do not add real integrations, real credentials, or production data handling unless the user explicitly asks for a separate technical plan.

## Reviewing sketches and copy

When the user supplies a sketch or wireframe, first translate it into a short journey map: page, purpose, input or content, next route, and any branch. Then implement the map using the repository patterns and call out anything the sketch leaves ambiguous.

When the user asks for copy changes, preserve the route structure, saved data keys, page order, and behaviour unless the request requires otherwise. Report the exact files and pages affected.

## Verification and handoff

After changing code:

1. Run the appropriate project build or check, normally `npm run build`.
2. Check the changed routes locally when possible, including the error state for new form pages.
3. Confirm that the relevant page, back link, branch, check answers page, and confirmation page load.
4. Tell the designer what changed, what assumptions remain, and which local URL or pages to review.

Keep publishing under the designer's control. When the prototype is ready to share, use `PUBLISHING.md` and GitHub Desktop; do not push service-specific work back to the original prototype kit repository.
