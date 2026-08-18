# Camden prototype kit

A small Express and Nunjucks prototype kit for Camden transactional services. It uses `lbcamden-frontend` for the Camden header, footer, button, CSS and static assets, with familiar prototype routes and session-backed data.

## For designers

Start with [DESIGNER-SETUP.md](DESIGNER-SETUP.md). It explains how to clone the repo with GitHub Desktop, open it in Codex, start the prototype on a Mac and stop it again.

When this repository is open in Codex, it includes a Camden prototyping skill in `.agents/skills`. A skill is a small set of instructions that helps Codex follow a repeatable process. It is not another app and it does not change your prototype by itself. It helps Codex understand how to inspect this kit, use the Camden patterns, explain its plan, make the changes and check the result. See [OpenAI's guide to Codex skills](https://learn.chatgpt.com/docs/build-skills) for the wider idea.

You can use the skill explicitly by starting a prompt with `$camden-prototyping`, or simply describe what you want in your own words. For example:

```text
$camden-prototyping Create a prototype for reporting a missed bin collection. Start by proposing the page flow, then build it using the existing Camden patterns and tell me which pages to review.
```

Use [PROMPTS.md](PROMPTS.md) when you want copy-paste prompt examples or more control over the brief. The skill and the prompt templates are complementary: the skill provides the process, while the templates provide examples of useful detail to include.

Use [PUBLISHING.md](PUBLISHING.md) when a prototype is ready to publish to GitHub, deploy on Render and password protect.

## What the skill does

The skill is most useful when you want Codex to:

- turn a service idea, sketch or wireframe into a page journey
- add form validation and saved answers
- add conditional branches, check answers or confirmation pages
- revise copy without accidentally changing the journey behaviour
- check the local prototype and give you pages to review

It encourages Codex to inspect the existing `permit` and `complaints` examples before editing, use `app/routes.js` and `app/views`, reuse Camden/GOV.UK components, and keep answers in the prototype session. You still decide what the service should do and which changes are ready to share.

## Run it

The easiest Mac option is to double-click:

```text
start.command
```

If macOS will not run the command files, set their permissions once:

```sh
chmod +x start.command update.command
```

For terminal use:

```sh
npm ci
npm run dev
```

Open `http://localhost:3000`.

If port `3000` is already in use, run it on `3010` instead:

```sh
npm run dev:3010
```

Open `http://localhost:3010`.

## Deployed prototype password

See [PUBLISHING.md](PUBLISHING.md) for GitHub publishing, Render deployment and deployed password instructions.

## Add a page

1. Create a Nunjucks view in `app/views`.
2. Add a GET route in `app/routes.js`.
3. For forms, add a POST route that validates input, writes to `req.session.data`, then redirects.

Views can read saved prototype data through the `data` object:

```njk
{{ data.postcode }}
```

## Camden frontend

The project imports `lbcamden-frontend` in `app/assets/sass/application.scss`, serves copied Camden assets from `/assets`, and exposes Camden component macros from `node_modules/lbcamden-frontend/lbcamden`.

Example:

```njk
{% from "components/button/macro.njk" import LBCamdenButton %}

{{ LBCamdenButton({
  text: "Continue",
  preventDoubleClick: true
}) }}
```

## Generating flows with Codex

Ask Codex to use the Camden prototyping skill and follow the existing sample flow:

> Add a Camden prototype journey for reporting a missed bin collection. Use pages for address lookup, collection type, contact details, check answers and confirmation. Store answers in `req.session.data`.

The important files for generated transactional journeys are:

- `app/routes.js`
- `app/views/layouts/main.njk`
- `app/views/macros/forms.njk`
- `app/views/<journey-name>/*.njk`
