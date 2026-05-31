#!/usr/bin/env node
'use strict';
import process from 'node:process';

import { State } from './state.mjs';
import { checkEnvironments, makeGithubRelease } from '../common/github.mjs';
import { tryPublish } from './publish.mjs';
import { getAffectedPackages } from '../common/repository.mjs';
import {
  addPkgFileChangesToStage,
  logAsSection,
  sequentiallyRun,
  throwIfUnableToProceed,
} from './utils.mjs';
import { addFileToStage, publishCommitAndTags, push } from '../common/git.mjs';
import { update } from './package.mjs';
import { build } from './build.mjs';
import { should } from '../common/features.mjs';
import { bumpClientAndRootVersionsAndGenerateRootChangelog } from './version-log.mjs';
import {
  upgradeAllDependents,
  snapshotOriginalVersions,
  revertDependentsForFailedPackages,
} from './upgrade.mjs';

async function run() {
  logAsSection('::group::🔍 Checking environments...');
  checkEnvironments();
  console.log('::endgroup::');

  // 1. Detect affected packages and increase version
  logAsSection('::group::🔍 Anlyzing dependencies...');
  const affectedPkgs = await getAffectedPackages();
  const libPkgs = affectedPkgs.filter((pkg) => !pkg.private);
  const clientPkgs = affectedPkgs.filter((pkg) => pkg.private);

  if (libPkgs.length === 0) {
    console.log('No library has changed. Skip.');
    process.exit(0);
  }

  console.log('Current state:');
  console.table(libPkgs);

  const state = new State(libPkgs);
  const updateTasks = libPkgs.map((pkg) => {
    return update(pkg).then((pkgState) => {
      state.setState(pkg.name, 'gitTag', pkgState.gitTag);
      state.setState(pkg.name, 'npmVersion', pkgState.npmVersion);
      state.setState(pkg.name, 'version', pkgState.version);
    });
  });
  await Promise.all(updateTasks);

  const pkgs = state.list();
  const pkgStates = pkgs.map((pkg) => state.getState(pkg.name));

  console.log('Next state:');
  console.table(
    pkgs.map((pkg) => ({
      name: pkg.name,
      ...state.getState(pkg.name),
    }))
  );

  throwIfUnableToProceed(pkgStates);
  console.log('::endgroup::');

  // 2. Generate root changelog and bump widget, app and root versions.
  logAsSection('::group::📋 Root changelog and versions...');
  await bumpClientAndRootVersionsAndGenerateRootChangelog();
  console.log('::endgroup::');

  // 3. Upgrade dependents BEFORE building.
  //
  // Critical ordering fix: Nx must see the bumped dependency versions in
  // package.json files before it starts resolving the build graph. Previously,
  // upgradeDependents ran inside publishTask (after the build), so Nx was
  // resolving stale versions and failing.
  //
  // We snapshot the *original* (pre-bump) version of each package so that if
  // a publish fails later, we can surgically revert only the entries for the
  // failed packages inside each dependent's package.json — without touching
  // the entries that belong to packages that published successfully.
  logAsSection('::group::⬆️  Upgrading dependents before build...');

  // Snapshot original versions BEFORE the upgrade rewrites package.json files.
  // `pkgs` here already has the bumped version from state.list(), so we read
  // from `libPkgs` which still holds the original version strings.
  const originalVersions = snapshotOriginalVersions(libPkgs);

  await upgradeAllDependents(pkgs);
  console.log('::endgroup::');

  // 4. Build all packages (Nx now sees the correct, up-to-date versions).
  //
  // NOTE: We build all libs in parallel. Parcel has a limitation on concurrent
  // instances, but for publishing we use esbuild, so this is not a concern.
  // If a Parcel app is added later, filter it out and run it sequentially.
  logAsSection(`::group::🔨 Start building...`);
  await build(pkgs);
  console.log('::endgroup::');

  // 5. Publish
  logAsSection(`::group::🚀 Start publishing...`);
  try {
    await tryPublish(pkgs, {
      onUpdateState: state.setState.bind(state),
    });
  } catch (e) {
    console.error(e);

    /** @type {import('../common/typedefs.mjs').Package | undefined} */
    const failedPkg = e.cause?.pkg;

    if (!failedPkg) {
      console.error(
        "🚨 The error hasn't thrown `pkg`. Here is more information to debug"
      );
      console.log(state.toJSON());
    } else {
      // Stage whatever partial file changes exist for the failed package.
      await addPkgFileChangesToStage(failedPkg).catch(console.warn);

      // Determine which packages did NOT make it to npm.
      // A package with npmVersion in state was published successfully.
      const failedPkgs = pkgs.filter(
        (pkg) => !state.getState(pkg.name, 'npmVersion')
      );

      // Surgically revert dependency entries for failed packages across the
      // entire workspace. Dependents that reference multiple packages from this
      // publish run will only have the failed packages' entries reverted —
      // entries for successfully published packages are left at their new version.
      if (failedPkgs.length > 0) {
        console.warn(
          `⏪ Reverting ${failedPkgs.length} failed package(s) from dependents: ` +
            failedPkgs.map((p) => p.name).join(', ')
        );
        await revertDependentsForFailedPackages(
          failedPkgs,
          originalVersions
        ).catch(console.warn);
      }
    }
  }

  console.log('::endgroup::');

  // 6. Tag and Push.
  //
  // Only include packages that were successfully published to npm.
  // If a package failed mid-way (changelog, github release, etc.) we still
  // treat it as published and handle those edge cases manually.
  const listPkgsForTag = state.list().filter((pkg) => {
    return !!state.getState(pkg.name, 'npmVersion');
  });

  logAsSection(
    '::group::🏷️ Tagging and commit...',
    `${listPkgsForTag.length} packages for tagging.`
  );
  if (listPkgsForTag.length > 0) {
    performance.mark(`start-publish-tagging`);

    // Client packages had their package.json updated to reference the new
    // lib versions — include them in the commit even though they're not tagged.
    await sequentiallyRun(
      clientPkgs.map(
        (pkg) => () => addFileToStage(`${pkg.location}`).catch(console.warn)
      )
    );

    await publishCommitAndTags(listPkgsForTag);
    await push();
    performance.mark(`end-publish-tagging`);
    const duration_tagging = performance.measure(
      `publish-tagging`,
      `start-publish-tagging`,
      `end-publish-tagging`
    ).duration;
    console.log(`Tagged. ${duration_tagging}ms`);
  } else {
    console.log('Skipped.');
  }

  console.log('::endgroup::');

  // 7. Making github release.
  // NOTE: Errors here are non-fatal — we log a warning and continue.
  console.log('::group::🐙 Github release');
  if (should('generateChangelog')) {
    if (listPkgsForTag.length > 0) {
      performance.mark(`start-publish-gh-release`);

      const tasks = listPkgsForTag.map((pkg) => {
        return makeGithubRelease(pkg)
          .then(() => {
            state.setState(pkg.name, 'githubRelease', pkg.version);
          })
          .catch(console.warn);
      });

      await Promise.all(tasks);

      performance.mark(`end-publish-gh-release`);
      const duration_release = performance.measure(
        `publish-gh-release`,
        `start-publish-gh-release`,
        `end-publish-gh-release`
      ).duration;
      console.log(`Finished. ${duration_release}ms`);
    } else {
      console.log('Skipped.');
    }
  } else {
    console.log('Skipped as it set on environments.');
  }
  console.log('::endgroup::');

  // 8. Report
  console.log('::group::📊 Report');
  console.table(
    pkgs.map((pkg) => ({
      name: pkg.name,
      ...state.getState(pkg.name),
    }))
  );
  console.log('::endgroup::');
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});