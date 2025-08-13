
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

### **Next (Staging)**

A publish to **Preview** is triggered automatically when a Pull Request is merged into `next`.

---

### **Production**

We now have **two ways** to release production:

---

#### **Option 1 — Automatic (Recommended)**

Run the **`Production Release`** workflow.
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

5. **Post-Release**

   * Merge `main` back into `next` to keep branches in sync.

**After finishing:**

* Send a highlight note on Telegram [like this](https://t.me/c/1797229876/15255/23609).
* Update `widget-examples`:

  ```sh
  yarn add @rango-dev/widget-embedded@latest
  ```

  Open a PR to ensure all examples are on the latest version.

---

#### **Option 2 — Manual**

If you need more control or want to run steps separately:

1. **Run `Main Sync`**

   * Pull latest translations on `next`.
   * Merge `next` into `main` using `--no-ff`.

2. **Run `Publish`** *(on `main`)*

   * Automatically bump `widget/app` and/or `widget/playground` versions if changed.
   * Automatically update the root `CHANGELOG.md`.
   * Publish to NPM.
   * Deploy to Vercel (Preview).

3. **Promote** *(manual step)*

   * Copy deploy URLs from logs.
   * Promote widget and playground to **Production** in Vercel.

4. **Run `Post-Release`**

   * Merge `main` back into `next`.

5. **After finishing**

   * Send Telegram highlight note.
   * Update `widget-examples` as in automatic flow.

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
     │ 5. Post-Release (main → next)               │
     └─────────────────────────────────────────────┘
                          │
                          ▼
              Send Telegram note + update widget-examples
```

```
                ┌───────────────────┐
                │    Manual Flow    │
                └───────────────────┘
                          │
                Run "Main Sync" manually
                          │
                          ▼
                 Run "Publish" on main
                          │
                          ▼
                  Deploy (Preview)
                          │
                          ▼
         Promote to Production in Vercel (manual)
                          │
                          ▼
               Run "Post-Release" manually
                          │
                          ▼
              Send Telegram note + update widget-examples
```

