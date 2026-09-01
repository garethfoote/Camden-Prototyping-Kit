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

## Question-page defaults

Use the GOV.UK Design System question-page pattern as the default for form journeys. Read the linked guidance when a request involves an unfamiliar page type or a deliberate exception.

- Start with one thing per page: normally one piece of information, one decision, or one question.
- Use a single-column form within the existing page scaffold: back link, `govuk-width-container`, grid row, `govuk-grid-column-two-thirds`, one clear page heading, form content, and a left-aligned `Continue` button.
- Make the heading specific to the current page. Do not repeat the same heading across pages. Use a question as the heading for a straightforward question, or a statement when the page needs explanatory content or groups related questions.
- Keep one main `h1` per page. Use a GOV.UK caption when a higher-level section needs to be shown, rather than making the section name the page heading.
- Use hint text only for short information that helps most users answer. Keep it to one short sentence without a full stop and do not put links in it. Put longer explanations in normal paragraphs, lists, or examples before the form control.
- Keep the default Camden spacing, widths, typography, form groups, and button patterns. Do not add page-specific spacing or heading sizes to make a layout “look better”.
- Start without a progress indicator. Add one only when research shows that users need help understanding where they are in a long or complex journey, and keep it accessible and accurate.

If user research supports grouping multiple related questions on one page, use a statement heading and make each label or legend easy to scan. Explain the research or rationale in the journey proposal before implementing the grouping.

Read:

- [Question pages](https://design-system.service.gov.uk/patterns/question-pages/)
- [Structuring forms: one thing per page](https://www.gov.uk/service-manual/design/form-structure)

## Camden layout and spacing examples

Use these live Camden pages as concrete references when building a form page:

- [Page without hint text: Who is starting this form?](https://nominate-housing-advocate.forms.camden.gov.uk/who-is-staring-this-form)
- [Page with hint text: Are you a tenant or housing applicant?](https://nominate-housing-advocate.forms.camden.gov.uk/person-requesting-advocacy/application-type)

These examples illustrate the structure and use of the frontend library rather than fixed pixel values. For both types of page:

- Keep the content in the standard hierarchy: `govuk-main-wrapper`, `govuk-width-container`, `govuk-grid-row`, and `govuk-grid-column-two-thirds-from-desktop`.
- Keep the question, controls, and `Continue` button aligned to the same two-thirds content column.
- Use the existing `govuk-!-margin-top-4` and `govuk-!-margin-top-7` utility classes where the page pattern calls for them. Do not replace them with guessed or page-specific margins.
- Use the standard `govuk-fieldset__legend--xl` heading treatment, form-group structure, radios or checkboxes, and Camden button class.
- Without hint text, follow the legend with the controls using the component’s standard spacing.
- With hint text, place one short `.govuk-hint` after the legend and before the controls. Connect it to the fieldset with `aria-describedby`; let the library provide its standard spacing rather than adding empty paragraphs or compensating margins.
- Let long headings wrap naturally within the column. Do not change the font size, line height, column width, or spacing for one page to force a preferred appearance.

## Fieldsets, radios, and checkboxes

Use a fieldset when multiple inputs are related and need one shared question or statement. The first element must be a legend that describes the group. For one question on a page, the legend can also be the page heading; for grouped questions, keep the legend as a group label rather than a second page heading.

For radios and checkboxes:

- Use radios only when the user must choose one option. Use checkboxes when they may choose more than one.
- Group radios in a fieldset with a legend that describes the question.
- Group related checkboxes in a fieldset with a legend that describes the question. A single checkbox can be used for one standalone choice or agreement.
- Do not pre-select an option unless there is a strong, evidenced reason.
- Use conditional radios only to reveal a simple, related question, such as a contact detail that is needed for the selected option.
- Apply the same conditional-reveal rules to checkboxes. A checkbox reveal must still be a simple, related question and must support more than one selected option when the design allows it.
- Do not use conditional reveals for a complicated or multi-part question; put that question on the next page.
- Do not reveal explanatory text, warnings, sections, or other non-question content with conditional radios.
- Do not use conditional reveals to show a whole form section or a sequence of questions.
- Do not conditionally reveal questions from inline yes/no radios.

When using conditional radios or checkboxes, make sure the revealed field is not required while hidden and that changing the answer does not leave an obsolete answer in the session or on the Check answers page.

Read:

- [Fieldset](https://design-system.service.gov.uk/components/fieldset/)
- [Radios](https://design-system.service.gov.uk/components/radios/)
- [Checkboxes](https://design-system.service.gov.uk/components/checkboxes/)

## Branching, validation, and errors

Ask eligibility or suitability questions early when the answers determine whether the user needs to continue or which questions they see. Use branching to avoid asking irrelevant questions, but keep the journey understandable and make sure users can go back and change the answer that determined the branch.

When a branch means a question is irrelevant, do not show it or require it. If changing an answer removes a branch, clear or ignore obsolete answers and ensure the Check answers page shows only relevant information.

For validation:

- Always show an error summary at the top of the page, even when there is only one error.
- Link every summary error to the relevant input or fieldset.
- Use the same wording in the summary and next to the field, and explain how to fix the problem.
- Preserve values the user has already entered when redisplaying a page after an error.
- Put an inline error message after the label and hint, before the input, and keep the input's accessible description connected to the error.
- Do not use a validation error to communicate service-level ineligibility; use an explanatory page or outcome instead.

Read:

- [Error summary](https://design-system.service.gov.uk/components/error-summary/)
- [Error message](https://design-system.service.gov.uk/components/error-message/)
- [Validation](https://design-system.service.gov.uk/patterns/validation/)

## Check answers and deviations

Suggest a Check answers page by default for any multi-page journey or transaction that collects and submits user information. Place it immediately before confirmation for small or medium-sized transactions. Include relevant sections only, show saved answers clearly, and add an accessible Change link for each section or answer.

If a journey does not need a Check answers page, explain why in the proposal. If any GOV.UK default above needs to be broken, do not silently implement the exception. State:

1. The default pattern.
2. The proposed deviation.
3. Why it may be appropriate, including any research or service constraint.
4. The effect on page length, accessibility, validation, branching, or review.

Ask the user to confirm the deviation before implementing it, unless they have already clearly requested and confirmed that specific exception.

Read:

- [Check answers](https://design-system.service.gov.uk/patterns/check-answers/)
- [Confirmation pages](https://design-system.service.gov.uk/patterns/confirmation-pages/)

## Design and implementation rules

- Follow Camden frontend and GOV.UK patterns already present in the repository.
- Prefer existing macros, classes, spacing, buttons, labels, hints, error messages, summary lists, and confirmation patterns.
- Treat the existing Camden frontend library as the source of truth for components, markup, styles, spacing, typography, buttons, and form controls.
- Do not create a custom component, custom CSS style, custom button style, custom form control, or custom spacing system when an existing frontend-library pattern fits.
- Do not override frontend-library styles just to make a page look more polished or match a sketch. Only deviate when the user gives explicit instructions to do so; first explain the reason and the likely maintenance, accessibility, and consistency impact, then wait for confirmation where the request is not already explicit.
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
