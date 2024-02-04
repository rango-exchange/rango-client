# Release

## How we are releasing a new version?

A release can be a lib or an app/client release. We are publishing our libs to `npm` and deploying our apps (client) on `vercel`.

If a package is app, you need to add the package name to `scripts/deploy/config.mjs` and then after getting a `PROJECT_ID` from Vercel, you need to set it as enviroment variable as well.

There are main commands:

`yarn run publish` for publishing our NPM packages.
`yarn run deploy` to deploy apps on Vercel.

### Publish flow

#### Prerelase

Our publish script will do these steps:

1. Get the last release (by using git tags) and calculate changes since then.
2. Bump the version for changed packages.
3. Create changelog, git tags and github release, and publish them to NPM.
4. Make a publish commit and push the updated packages (version) and tags to origin.

Note:
Libs will be published under `next` tag on npm, which means you need to use `yarn add @rango/test-package@next` to install the published version whenever you need.

#### Production relase

There is a workflow called `Production Release`, you just need to run this workflow manually and then it will automatically published.


### Deploy flow

You should manually trigger the `deploy` workflow.

By running `yarn run deploy`, it will build all the apps/clients then will try to deploy them on vercel.

If the workflow is running on `next` branch, it will be deployed as Vercel's `preview`. If not, it's production release.

All the apps published by `prerelase` workflow will be published under the Vercel's `preview` enviroment.

## How you can release a new version?

### Next (Staging)

A publish will be triggered when a **Pull Request** has been merged.

First it tries to extracting translations (if any) and push them onto Crowdin, then releasing libraries will be started.
_Note 1_: Syncing translations (first workflow) is an optional step which means if it fails we will do the publish anyway.

### Production

For releasing production, you need to run `Production Release` workflow, it will pull the latest translation changes on `next` branch and checkout to `next` branch and pull the latest changes then it tries to merge the `next` into `main` by `--no-ff` strategy, To make sure that a new commit is made And previous commits that may have `[skips ci]` Do not prevent workflow from triggering.


_Note 1_: Make sure you are having permission for `push` on `main`.

In production, we don't run localization workflow again (crowdin) since we assume our `/translation` folder is in sync with Crowdin. if you think there is new translation, you can run `crowdin` workflow manually and then try to release.

At the end, a PR will be created to merge `main` into `next` after publishing the libraries. You need to check the PR description and make sure you are considering/doing them.
