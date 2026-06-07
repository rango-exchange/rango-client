
# **Release Guide**

## Overview

A release can involve:

* **Libraries** (published to `npm`)
* **Apps/Clients** (deployed to Vercel)

If a package is a client, ensure:

* The package name is listed in `scripts/deploy/config.mjs`.
* You have a `PROJECT_ID` from Vercel set as an environment variable.

---

## **Key Commands**

* `yarn run publish` → Publishes NPM packages.
* `yarn run deploy` → Deploys apps to Vercel.

---

## **Publish Flow**

The `publish` script performs:

1. Gets the last release (via git tags) and calculates changes.
2. Bumps versions for changed packages.
3. Creates changelogs, git tags, and GitHub releases.
4. Publishes updated packages to NPM.
5. Pushes updated package versions and tags to origin.

**OIDC trusted publishing:** Publishing authenticates to npm via a short-lived OIDC token — no `NPM_TOKEN` secret needed. This requires each package to trust `delivery.yml`(the workflow you are publishing in it) in this repository on npmjs.com.

OIDC only works for packages that have been published at least once. For a new package:

1. Publish it manually the first time.
2. Ensure `repository.url` is set in the package's `package.json` and the root `package.json`.
3. Register it as a trusted publisher:
   ```sh
   npm trust github PACKAGE_NAME --file delivery.yml --allow-publish --yes
   ```

   To configure every workspace package at once, loop over the package names, e.g.:
   ```sh
   for pkg in $(yarn --silent workspaces list --json | jq -r 'select(.location != ".") | .name'); do
     npm trust github "$pkg" --file delivery.yml --allow-publish --yes
   done
   ```
   

**If run on `main` branch**, the publish script will also:

* Automatically bump `widget/app` and/or `widget/playground` versions if changed.
* Automatically update the root `CHANGELOG.md`.

**Note:** Libraries are published under the `next` tag on npm. To install them:

```sh
yarn add @rango-dev/widget-embedded@next
```

---

## **Deploy Flow**

Running `yarn run deploy`:

* Builds all apps/clients.
* Deploys them to Vercel.

**Branch behavior:**

* On `next` → Deploys to Vercel **Preview** environment.
* On `main` → Deploys to **Production** environment.

---

## **Release Types**

### Experimental

You can trigger an experimental release (base branch should be `main`) by running the **`Delivery`** workflow manually from your branch (leave `full_release` unchecked).


### **Next (Staging)**

A publish to **Preview** is triggered automatically when a Pull Request is merged into `next`.

---

### **Production**

**Note:** Ensure that all modifications to the `Delivery` workflow are implemented as a hotfix to the `main` branch to guarantee that we have the most recent updates while executing the workflow.

Run the **`Delivery`** workflow manually with **`full_release`** checked.


It will:

1. **Sync `main` with `next`**

   * Pull latest translations on `next`.
   * Merge `next` into `main` using `--no-ff`.

2. **Publish** *(on `main`)*

   * Automatically bump `widget/app` and/or `widget/playground` versions if changed.
   * Automatically update the root `CHANGELOG.md`.
   * Publish to NPM.

3. **Deploy**

   * Build and deploy apps to Vercel (Preview).
   * **You must copy the deploy URLs from the logs.**

4. **Promote** *(manual step)*

   * Promote the widget and playground deployments to **Production** in Vercel.

5. **Sync `next` with `main`**

   * Merge `main` back into `next` to keep branches in sync.

**After finishing:**

* Send a highlight note on Telegram [like this](https://t.me/c/1797229876/15255/23609).
* Update `widget-examples`:

  ```sh
  yarn add @rango-dev/widget-embedded@latest
  ```

  Open a PR to ensure all examples are on the latest version.

---



## **Visual Diagram**

```
  push to `next` /                  workflow_dispatch
  workflow_dispatch                  (full_release = true)
  (full_release = false)                     │
        │                                    │
        ▼                                    ▼
  ┌──────────┐              ┌──────────────────────────────────────┐
  │ publish  │              │ 1. sync-prod  (next → main, --no-ff) │
  │  (OIDC)  │              │ 2. publish    (OIDC, on main)        │
  └──────────┘              │ 3. deploy     (Vercel Preview)       │
  prerelease tag            │ 4. Promote to Production  (manual)   │
  or experimental tag       │ 5. sync-next  (main → next)          │
                            └──────────────────────────────────────┘
                                             │
                                             ▼
                             Send Telegram note + update widget-examples
```

