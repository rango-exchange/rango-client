
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

You can trigger an experimental release (base branch should be `main`) by running `Publish` workflow manually for your branch.


### **Next (Staging)**

A publish to **Preview** is triggered automatically when a Pull Request is merged into `next`.

---

### **Production**

**Note:** Ensure that all modifications to the `Production Release` workflow are implemented as a hotfix to the `main` branch to guarantee that we have the most recent updates while executing the workflow.


Run the **`Production Release`** workflow from the `main` branch (the workflow fails fast if dispatched from any other branch).


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

### **Hotfix (Production)**

Use this flow when a fix must reach production without releasing what is currently on `next` (staging):

1. Merge the fix directly into `main`.
2. Run the **`Production Release`** workflow from `main` with the **hotfix** checkbox checked.

With the hotfix option enabled:

* The **Sync `main` with `next`** step is skipped, so `main` is released as-is — no staging commits are pulled in.
* Publish and Deploy run exactly as in a normal production release.
* **Sync `next` with `main`** is also skipped — `next` contains unreleased work, so this merge is likely to conflict. After the hotfix release, merge `main` back into `next` manually (e.g. via a PR) to carry the hotfix and version-bump commits to staging and resolve any conflicts deliberately.

---



## **Visual Diagram**

```
                ┌─────────────────────┐
                │    Automatic Flow   │
                └─────────────────────┘
                          │
                Run "Production Release"
                          │
                          ▼
     ┌─────────────────────────────────────────────┐
     │ 1. Sync main ← next                         │
     │ 2. Publish (bump + changelog + NPM publish) │
     │ 3. Deploy (Preview)                         │
     │ 4. Promote to Production (manual)           │
     │ 5. Sync next (main → next)               │
     └─────────────────────────────────────────────┘
                          │
                          ▼
              Send Telegram note + update widget-examples
```

