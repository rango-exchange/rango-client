#!/usr/bin/env node
'use strict';
import process from 'node:process';

import {
  buildPackages,
  changed,
  detectChannel,
  exportNx,
  generateChangelog,
  getLastReleasedHashId,
  increaseVersionForMain,
  increaseVersionForNext,
  logAsSection,
  makeGithubRelease,
  publishPackages,
  pushToRemote,
  tagPackagesAndCommit,
} from './utils.mjs';
import { Graph } from '../common/graph/index.mjs';
import { nxToGraph } from '../common/graph/helpers.mjs';
import { execa, $ } from 'execa';
import { performance } from 'node:perf_hooks';
import { packageNamesToPackagesWithInfo } from '../common/utils.mjs';
import { groupPackagesForDeploy } from '../deploy/utils.mjs';

// TODO: Working directory should be empty.
async function run() {
  // Detect last relase and what packages has changed since then.
  const channel = detectChannel();
  const useTagForDetectLastRelease = channel === 'prod';
  const baseCommit = await getLastReleasedHashId(useTagForDetectLastRelease);
  const changedPkgs = await changed(baseCommit);

  // Info logs
  logAsSection('Run...', `at ${baseCommit}`);

  console.log(
    changedPkgs
      .map((pkg) => `- ${pkg.name} (current version: ${pkg.version})`)
      .join('\n')
  );

  // If any package has changed, we exit from the process.
  if (changedPkgs.length === 0) {
    console.log(`There is no changed package since ${baseCommit}`);
    process.exit(0);
  }

  console.log(`::group::Analyze & Depndency Graph`);
  performance.mark('start-analyze');
  const nxGraph = await exportNx();
  const graph = new Graph();
  nxToGraph(nxGraph, graph);
  graph.onlyAffected(changedPkgs.map((pkg) => pkg.name));
  const sortedList = graph.sort();
  const sortedPackagesToPublish = await packageNamesToPackagesWithInfo([
    ...sortedList,
  ]);
  performance.mark('end-analyze');

  console.log(
    `Execution time: ${
      performance.measure('analyze', 'start-analyze', 'end-analyze').duration
    }ms`
  );
  console.log(
    'Packages will be published, in this order:\n',
    sortedPackagesToPublish.map((pkg) => pkg.name).join(' -> ')
  );
  console.log('::endgroup::');

  const updatedPackages = [];
  for (const pkg of sortedPackagesToPublish) {
    const updatedPkg = await publish(pkg, channel);
    updatedPackages.push(updatedPkg);
  }
  // We did some changes to package's depencies, we need to update lockfile as well.
  await $`yarn`;

  // Git tag & commit
  console.log(`::group::Tag, commit and push to repository.`);
  logAsSection(`Git Tagging..`);
  const tagOptions =
    channel === 'prod' ? { skipGitTagging: false } : { skipGitTagging: true };
  await tagPackagesAndCommit(updatedPackages, tagOptions);

  logAsSection(`Pushing tags to remote...`);
  const branch = channel === 'prod' ? 'main' : 'next';
  await pushToRemote(branch);
  logAsSection(`Pushed.`);
  console.log('::endgroup::');
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});

/* -------------- Flows ------------------ */

// TODO: add yarn.lock
async function publish(changedPkg, channel) {
  // TODO: If affected pkg, commit a fix: upgrade pkg
  console.log(`::group::Publish ${changedPkg.name} (${channel})`);
  performance.mark(`start-publish-${changedPkg.name}`);

  // 1. Version
  let updatedPackages;
  if (channel === 'prod') {
    updatedPackages = await increaseVersionForMain([changedPkg]);
  } else {
    updatedPackages = await increaseVersionForNext([changedPkg]);
  }

  console.log(
    updatedPackages
      .map(
        (pkg) => `[x] Versioninig: ${pkg.name} (next version: ${pkg.version})`
      )
      .join('\n')
  );

  // 2. Changelog & Github Release
  if (channel === 'prod') {
    await Promise.all(
      updatedPackages.map((pkg) => generateChangelog(pkg, { saveToFile: true }))
    );

    await Promise.all(updatedPackages.map(makeGithubRelease));
    logAsSection(`[x] Github Release & Changelog generated.`);
  }

  // 3. Build & Publish on NPM
  const packages = groupPackagesForDeploy(updatedPackages);
  if (packages.npm.length) {
    performance.mark(`start-publish-build-${changedPkg.name}`);
    await buildPackages(packages.npm);
    performance.mark(`end-publish-build-${changedPkg.name}`);
    const duration_build = performance.measure(
      `publish-build-${changedPkg.name}`,
      `start-publish-build-${changedPkg.name}`,
      `end-publish-build-${changedPkg.name}`
    ).duration;
    logAsSection(`[x] Build for NPM ${duration_build}ms`);
    performance.mark(`start-publish-npm-${changedPkg.name}`);
    const distTag = channel === 'prod' ? 'latest' : 'next';
    await publishPackages(packages.npm, distTag);
    performance.mark(`end-publish-npm-${changedPkg.name}`);
    const duration_npm = performance.measure(
      `publish-npm-${changedPkg.name}`,
      `start-publish-npm-${changedPkg.name}`,
      `end-publish-npm-${changedPkg.name}`
    ).duration;
    logAsSection(`[x] Publish on NPM ${duration_npm}ms`);
  }

  // 5. Yarn upgrade-all
  const { stdout: upgradeStdOut } = await execa('yarn', [
    'upgrade-all',
    changedPkg.name,
    '--no-install',
  ]);
  console.log(`::debug::yarn upgrade-all ${changedPkg.name} '--no-install'`);
  console.log(`::debug::${upgradeStdOut}`);
  logAsSection('[x] Upgrade all package users.');

  performance.mark(`end-publish-${changedPkg.name}`);
  const duration_publish = performance.measure(
    `publish-${changedPkg.name}`,
    `start-publish-${changedPkg.name}`,
    `end-publish-${changedPkg.name}`
  ).duration;
  console.log(`Execution time: ${duration_publish}ms`);
  console.log(`::endgroup::`);

  return updatedPackages[0];
}
