# Release

## How we are releasing a new version?

A release can be a lib or an app/client release. We are publishing our libs to `npm` and deploying our apps (client) on `vercel`.

If a package is client, you need to add the package name to `scripts/deploy/config.mjs` and then after getting a `PROJECT_ID` from Vercel, you need to set it as environment variable as well.

There are main commands:

`yarn run publish` for publishing our NPM packages.
`yarn run deploy` to deploy apps on Vercel.

### Publish flow

#### Prerelease

Our publish script will do these steps:

1. Get the last release (by using git tags) and calculate changes since then.
2. Bump the version for changed packages.
3. Create changelog, git tags and github release, and publish them to NPM.
4. Make a publish commit and push the updated packages (version) and tags to origin.

Note:
Libs will be published under `next` tag on npm, which means you need to use `yarn add @rango/test-package@next` to install the published version whenever you need.

#### Production release

There is a workflow called `Production Release`, you just need to run this workflow manually and then it will automatically published.


### Deploy flow

You should manually trigger the `deploy` workflow.

By running `yarn run deploy`, it will build all the apps/clients then will try to deploy them on vercel.

If the workflow is running on `next` branch, it will be deployed as Vercel's `preview`. If not, it's production release.

All the apps published by `prerelease` workflow will be published under the Vercel's `preview` environment.

## How you can release a new version?

### Next (Staging)

A publish will be triggered when a **Pull Request** has been merged.

First it tries to extracting translations (if any) and push them onto Crowdin, then releasing libraries will be started.
_Note 1_: Syncing translations (first workflow) is an optional step which means if it fails we will do the publish anyway.

### Production

#### Overview

Follow these steps for the release:

1. Run the `Production Release` workflow manually.
2. When workflow finished, make sure you've updated changelog and created a PR, as it explained below.
3. Run the `Deploy` workflow if the publish was successful.
4. Promote our clients (widget and playground) to production on Vercel (ask the team if you don't have access).
5. Create a pull request from the `main` branch to `next` to update the `next` branch , ensuring not to merge it using the `Rebase and merge` strategy; instead, use the `Create a merge commit` strategy for merging.


**NOTE 1:**

Ensure you send a highlight note on Telegram [like this](https://t.me/c/1797229876/15255/23609) at the end.

**NOTE 2:**

Ensure you update widget-examples using `yarn add @rango-dev/widget-embedded@latest`. Then open a new PR on the repo to ensure all examples are on the latest version.

#### Details

For releasing production, you need to run `Production Release` workflow, it will pull the latest translation changes on `next` branch and checkout to `next` branch and pull the latest changes then it tries to merge the `next` into `main` by `--no-ff` strategy, To make sure that a new commit is made And previous commits that may have `[skips ci]` Do not prevent workflow from triggering.


We are running `crowdin` workflow inside `release` workflow which means before any release we will extract and push strings to Crowdin then pull all the strings from Crowdin to make sure we have latest changes on releases.

Before deploying and after releasing production, you will need to manually increase the `widget/app` and `widget/playground` version and write the changelog.

**NOTE:** Create a hotfix branch then do the following steps to commit changes to open a PR.

Steps:
If widget has any updates:

```shell
cd widget/app
yarn version --minor --no-git-tag-version
```

if playground has any changes:

```shell
cd widget/playground
yarn version --minor --no-git-tag-version
```

Then you need to update `/CHANGELOG.md` (root) and list all the changes into widget or playground. you can use the template at the end of list. _Don't forget to use correct date and version (that you've ran before)._

Finally, you can commit your changes, run the following commands from workspace's root:

```shell
git add CHANGELOG.md
git add widget/app/package.json
git add widget/playground/package.json

git commit -m "chore(release): deploy" -m "[skip ci]"
```
