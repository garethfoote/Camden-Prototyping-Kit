# Designer setup

This guide is for Camden designers using a Mac. You do not need to be a developer to run the prototype kit locally.

## What to install

Install these apps first:

- [GitHub Desktop](https://desktop.github.com/download/), to clone and update the repository.
- [Codex](https://openai.com/codex/), to ask for changes to journeys and pages.
- The current [Node.js](https://nodejs.org/en) 22 LTS desktop installer, to run the prototype on your Mac.
- (optional) [Visual Studio Code](https://code.visualstudio.com/), to open and read the code when you want to inspect what Codex changed.


The normal Node.js desktop installer includes `node` and `npm`. It does not include `nvm`, and designers do not need `nvm`.

If you already use `nvm`, the project includes `.nvmrc` so `start.command` and `update.command` can select Node 22 for you.

## Clone with GitHub Desktop

1. Open GitHub Desktop.
2. Choose **File > Clone repository**.
3. Select this repository from GitHub.
4. Choose where to save it on your Mac.
5. Click **Clone**.

## Open the repo in Codex

1. Open Codex.
2. Choose **File > Open folder**.
3. Select the folder you cloned with GitHub Desktop.
4. This will create a project with the name of the cloned repo.
5. From here you can start prompting.

Useful copy-paste prompts are in [PROMPTS.md](PROMPTS.md).

## What is a skill?

A Codex skill is a set of instructions for a repeatable type of work. This repository includes a Camden prototyping skill so you do not need to remember all the technical patterns or find the perfect prompt before you begin. You can read [OpenAI's guide to Codex skills](https://learn.chatgpt.com/docs/build-skills) for a general explanation.

The skill helps Codex to:

- understand that this is a Camden transactional prototype
- inspect the existing example journeys before making changes
- propose a page flow and point out assumptions
- use the existing Camden frontend and GOV.UK patterns
- add routes, Nunjucks pages, validation and session-backed answers consistently
- check the result and tell you which pages to review

It does not replace your design judgement. You still describe the service, users, questions and content. It also does not publish anything automatically.

## Use the Camden prototyping skill

With the repository open in Codex, start with a plain-language request. You can mention the skill explicitly with `$camden-prototyping`:

```text
$camden-prototyping I need a prototype for reporting a missed bin collection. Please propose the journey first, including any branches, then build it and give me the local URL to review.
```

You can also ask for a specific kind of change:

```text
$camden-prototyping Turn this attached sketch into Camden prototype pages. Keep the existing patterns, add sensible validation and include a check answers page.
```

```text
$camden-prototyping Add a conditional branch to this journey. First explain the routes and saved answers you will use, then implement and check it locally.
```

Codex should explain the proposed journey before making a substantial change. Review that explanation and correct the service details or wording before asking it to continue if needed.

If the skill does not appear after you update the repository, restart Codex. You can use the examples in [PROMPTS.md](PROMPTS.md) as a fallback or when you want to give Codex a particularly detailed brief.

## Open the code in VS Code

1. Open Visual Studio Code.
2. Choose **File > Open Folder**.
3. Select the folder you cloned with GitHub Desktop.

You can use VS Code to review pages, routes and copy changes. The most common files are in `app/routes.js` and `app/views`.

## Start the prototype

1. In Finder, open the cloned repository folder.
2. Double-click `start.command`.
3. Leave the Terminal window open while you use the prototype.

The first run may take a few minutes because it installs the project dependencies.

If macOS says it cannot run `start.command`, open Terminal in the repository folder and run:

```sh
chmod +x start.command update.command
```

Then double-click `start.command` again.

## View it in the browser

Open:

```text
http://localhost:3000
```

If port `3000` is busy, `start.command` will try:

```text
http://localhost:3010
```

The Terminal window will show the exact address to open.

## Stop the prototype

Click the Terminal window that is running the prototype, then press:

```text
Control+C
```

You can close the Terminal window after it stops.

## If the port is busy

If the Terminal says the port is busy:

1. Stop any other prototype Terminal windows with `Control+C`.
2. Double-click `start.command` again.
3. If it is still busy, ask Codex: `The Camden prototype port is busy. Help me find and stop the local process safely.`

## Update the kit

To get the latest repository changes:

1. Make sure the prototype is stopped.
2. Double-click `update.command`.
3. When it finishes, double-click `start.command`.

`update.command` gets the latest committed changes from GitHub, reinstalls the exact project dependencies, and runs a build check. It does not publish your work or make a commit.

If GitHub Desktop says you have local changes, ask Codex to review them before updating.

## Password protect a deployed prototype

See [PUBLISHING.md](PUBLISHING.md) for how to publish a prototype to GitHub, deploy it on Render and set a password for deployed access.
