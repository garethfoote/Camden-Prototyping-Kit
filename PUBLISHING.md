# Publishing and deploying a prototype

This guide explains how to publish a local Camden prototype to GitHub, deploy it on Render, and add a password for deployed access.

Use this when a prototype is ready to share outside your own Mac.

## Recommended workflow

1. Build or edit the journey locally with Codex.
2. Run the prototype locally and check it in the browser.
3. Create a new GitHub repository for this service prototype.
4. Point GitHub Desktop at the new repository, not the original template.
5. Review the changed files in GitHub Desktop or VS Code.
6. Commit the changes in GitHub Desktop.
7. Push the repository to GitHub.
8. Deploy the GitHub repository on Render.
9. Set a deployed prototype password in Render.

Use GitHub Desktop for committing, publishing and pushing. It gives designers a visual review step before anything is sent to GitHub. Use Codex when you want help checking changes, writing a commit message, or fixing a GitHub Desktop warning.

Do not push service-specific prototype changes back to the original prototype kit repository. Keep the original repository as a clean template.

## GitHub account

You need a GitHub account before you can publish a prototype.

1. Go to `https://github.com`.
2. Sign in, or create an account if you do not have one.
3. Open GitHub Desktop and sign in with the same GitHub account.

## Repository name

Name the GitHub repository after the service or transaction. Use lowercase words separated by hyphens.

For a goose reporting tool called **Report a Goose Sighting**, use:

```text
camden-report-a-goose-sighting-prototype
```

Other examples:

```text
camden-missed-bin-collection-prototype
camden-parking-permit-prototype
camden-council-tax-discount-prototype
```

## Create a new GitHub repository

Do this before pushing changes from GitHub Desktop.

1. Go to `https://github.com`.
2. Sign in if GitHub asks you to.
3. In the top navigation, click the **+** icon.
4. Choose **New repository**.
5. Choose the owner. This might be your own account or a Camden team or organisation account.
6. In **Repository name**, enter the service prototype repository name, for example:

```text
camden-report-a-goose-sighting-prototype
```

7. In **Description**, add a short description if useful, for example:

```text
Prototype for reporting a goose sighting in Camden.
```

8. Choose **Private** unless you have been told to make it public.
9. Leave **Add a README file** unticked.
10. Leave **Add .gitignore** set to **None**.
11. Leave **Choose a license** set to **None**.
12. Click **Create repository**.
13. GitHub will show a page headed something like **Quick setup**.
14. Copy the repository URL. Use the HTTPS URL unless your team has told you to use SSH. It will look like:

```text
https://github.com/YOUR-ACCOUNT/camden-report-a-goose-sighting-prototype.git
```

The new GitHub repository should be empty. That is expected. The files already exist on your Mac and will be pushed from GitHub Desktop.

## Point GitHub Desktop at the new repository

If you cloned the original Camden prototype kit, GitHub Desktop is still connected to that original template repository. Change the remote before you push.

1. Open GitHub Desktop.
2. Select the local prototype repository.
3. In the menu bar, choose **Repository > Repository Settings**.
4. Choose the **Remote** pane.
5. Under **Primary remote repository**, replace the existing URL with the new GitHub repository URL.
6. Click **Save**.

After saving, GitHub Desktop should push to the new service repository instead of the original template.

To check it is correct:

1. In GitHub Desktop, choose **Repository > View on GitHub**.
2. Confirm the browser opens the service repository, for example:

```text
camden-report-a-goose-sighting-prototype
```

If it opens the original template repository, stop and ask Codex to help before pushing.

## Commit the prototype in GitHub Desktop

1. Open GitHub Desktop.
2. Select the prototype repository.
3. Check the changed files list.
4. Use VS Code or Codex to review anything you are unsure about.
5. Enter a short commit message, for example:

```text
Add goose sighting journey
```

6. Click **Commit to main**.

## Publish or push to GitHub

After the new GitHub repository has been created and GitHub Desktop points to it:

1. Commit your changes in GitHub Desktop.
2. Click **Push origin**.

If GitHub Desktop shows a warning or conflict, stop and ask Codex to help. Do not force push unless someone technical has checked it.

## Deploy on Render

Render deploys from a GitHub repository. When you push new commits to GitHub, Render can redeploy the prototype automatically.

1. Go to `https://render.com`.
2. Sign in, or create an account.
3. Choose **New**.
4. Choose **Web Service**.
5. Connect your GitHub account if Render asks.
6. Select the prototype repository, for example:

```text
camden-report-a-goose-sighting-prototype
```

7. Use these settings:

```text
Name: camden-report-a-goose-sighting-prototype
Language: Node
Build Command: npm ci
Start Command: npm start
```

8. Add the environment variables listed below.
9. Create the web service and wait for the first deploy to finish.

Render automatically provides the `PORT` value the app needs. Do not set `PORT` yourself.

## Render free services

Render's free web services go to sleep after 15 minutes without traffic. This is normal.

When someone opens the prototype after it has gone to sleep, Render wakes it up again. The first page load can take about a minute while this happens, and Render may show a loading page. After it wakes up, the prototype should feel normal again.

This is usually fine for sharing prototypes. If the delay becomes a problem for frequent research sessions or stakeholder reviews, move the Render service to a paid instance type.

## Render environment variables

Add these before the first deploy if you can.

Required:

```text
PROTOTYPE_PASSWORD
```

Set this to the password people must enter before they can view the deployed prototype.

Recommended:

```text
SESSION_SECRET
```

Set this to a long random phrase. It is used to protect prototype session data.

Usually automatic on Render:

```text
NODE_ENV=production
```

Render normally sets `NODE_ENV` to `production` for Node services at runtime. If the deployed prototype does not ask for a password, check that `NODE_ENV` is `production` and that `PROTOTYPE_PASSWORD` is set.

## How the deployed password works

Local prototypes do not need a password. Deployed prototypes should have one.

When someone opens the deployed prototype, their browser will ask for a username and password.

- Username: anything
- Password: the value of `PROTOTYPE_PASSWORD`

Do not commit the password to GitHub and do not put it in the code.

If `PROTOTYPE_PASSWORD` is missing in production, the prototype will show a configuration error instead of opening without a password.

## After making more changes

When you make more changes locally:

1. Test the prototype on your Mac.
2. Commit the changes in GitHub Desktop.
3. Click **Push origin**.
4. Check Render to make sure the deploy succeeds.

## Ask Codex for help

Useful prompts:

```text
Review my local changes before I commit this Camden prototype. Tell me if anything looks risky for deployment.
```

```text
GitHub Desktop is showing a warning. Explain what it means and tell me the safest next step.
```

```text
Render failed to deploy this prototype. Inspect the logs and help me fix the deployment.
```
