
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

* `yarn run deploy` → Deploys apps to Vercel.

---

## **Publish Flow**

The `Publish` workflow runs these as separate steps, so a failure is easy to place.

**1. Versioning** — two commands, each its own script:

| Script | What it does |
| --- | --- |
| `yarn run publish:version <flag>` | Gets the last release (via git tags), works out which public packages changed, and computes their next version from the conventional commits. Nothing is written to `package.json` yet — the result is saved to a state file. |
| `yarn run publish:version:check` | Refuses to go on if any computed version is already on npm, already tagged, or already released on Github. |

`check` needs no flag — the state file records the channel.


**2. The repository and its clients** — the
[`release-root`](../.github/actions/release-root/action.yml) action, the part
of a release that `library version` / `library publish` leave out. **Only runs
on `--prod`, and only when stage 1 found a library to release** — the workflow
gates it on the `count` output of `publish:version`, so a change to a private
package alone doesn't bump anything. It is three commands, and only the last
one isn't rangutopia:

| Step | What it does |
| --- | --- |
| `rangutopia client version --prod --root --clients @rango-dev/widget-app,@rango-dev/widget-playground` | Bumps the repository version and the private clients (`widget/app`, `widget/playground`) from the conventional commits since the last release, and writes them on their `package.json`. |
| `rangutopia changelog generate --root --mention @rango-dev/widget-embedded --save` | Writes the root `CHANGELOG.md`, mentioning the version of the package our users install. |
| `git add` + `git commit` | Commits exactly those files (`package.json`, `CHANGELOG.md`, the two clients' `package.json`) as `chore(release): bump the repo and client versions` `[skip ci]`. Nothing is pushed here. |

It sits **before** `publish`: `--mention` reads `@rango-dev/widget-embedded`'s 
version out of the state file stage 1 saved, so it carries the version this 
release is about to publish instead of the one already out. The changelog 
header reads the root version, so`client version` still comes first within 
this action.

The commit is left unpushed on purpose: stage 3 pushes the branch, so this
commit only reaches the remote if the release actually happened — a publish
that fails leaves the bump and the changelog on the runner, and the next run
computes them again.

**3. `yarn run publish`** — `rangutopia library publish`. It takes no channel
flag: it reads the channel, along with the versions, out of the state
file stage 1 saved. It walks every package in dependency order: write 
the version on `package.json` (dependents included), write the package's
`CHANGELOG.md`, publish to npm. A package whose publish fails is rolled back to
the version it was on and the walk stops there. Then it commits everything as
`chore(release): publish`, tags each *published* package
(`package-name@version`), pushes — carrying stage 2's commit with it — and
creates the Github releases.

The same commands work by hand (`client version` is monorepo-only, which this
is), see the
[rangutopia README](https://github.com/rango-exchange/rangutopia#client-version)
for the flags.

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

   * Bump the repository, `widget/app` and `widget/playground` versions when a library is released.
   * Update the root `CHANGELOG.md`.
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

