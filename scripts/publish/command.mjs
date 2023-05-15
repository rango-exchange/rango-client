#!/usr/bin/env node
'use strict';

import {
  addChangelogsToStage,
  addUpdatedPackageJsonToStage,
  buildPackages,
  changed,
  deployProjectsToVercel,
  detectChannel,
  exportNx,
  generateChangelog,
  getLastReleasedHashId,
  groupPackagesForDeploy,
  increaseVersionForMain,
  increaseVersionForNext,
  logAsSection,
  makeGithubRelease,
  packageNamesToPackagesWithInfo,
  publishPackages,
  pushToRemote,
  tagPackages,
} from './utils.mjs';
import { Graph } from '../common/graph/index.mjs';
import { nxToGraph } from '../common/graph/helpers.mjs';
import { execa } from 'execa';

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
    changedPkgs.map((pkg) => `- ${pkg.name} (current version: ${pkg.version})`).join('\n'),
  );

  // If any package has changed, we exit from the process.
  if (changedPkgs.length === 0) {
    console.log(`There is no changed package since ${baseCommit}`);
    process.exit(0);
  }

  const nxGraph = await exportNx();
  const graph = new Graph();
  nxToGraph(nxGraph, graph);
  graph.onlyAffected(changedPkgs.map((pkg) => pkg.name));
  const sortedList = graph.sort();
  const sortedPackagesToPublish = await packageNamesToPackagesWithInfo([...sortedList]);

  console.log('Packages will be published, in this order:\n', sortedPackagesToPublish);

  const updatedPackages = [];
  for (const pkg of sortedPackagesToPublish) {
    const updatedPkg = await publish(pkg, channel);
    updatedPackages.push(updatedPkg);
  }

  // Add updated dependencies
  await addUpdatedPackageJsonToStage(sortedPackagesToPublish);

  // Git tag & commit
  logAsSection(`Git Tagging..`);
  const tagOptions = channel === 'prod' ? { skipGitTagging: false } : { skipGitTagging: true };
  await tagPackages(updatedPackages, tagOptions);

  logAsSection(`Pushing tags to remote...`);
  const branch = channel === 'prod' ? 'main' : 'next';
  await pushToRemote(branch);
  logAsSection(`Pushed.`);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});

/* -------------- Flows ------------------ */

// TODO: add yarn.lock
async function publish(changedPkg, channel) {
  // TODO: If affected pkg, commit a fix: upgrade pkg
  console.log('Publish:', `${changedPkg.name} (${channel})`);

  // 1. Version
  let updatedPackages;
  if (channel === 'prod') {
    updatedPackages = await increaseVersionForMain([changedPkg]);
  } else {
    updatedPackages = await increaseVersionForNext([changedPkg]);
  }

  console.log(
    updatedPackages
      .map((pkg) => `[x] Versioninig: ${pkg.name} (next version: ${pkg.version})`)
      .join('\n'),
  );

  // 2. Changelog & Github Release
  if (channel === 'prod') {
    await Promise.all(updatedPackages.map(generateChangelog));
    await addChangelogsToStage(updatedPackages);

    await Promise.all(updatedPackages.map(makeGithubRelease));
    logAsSection(`[x] Github Release & Changelog generated.`);
  }

  // 3. Build & Publish on NPM
  const packages = groupPackagesForDeploy(updatedPackages);
  if (packages.npm.length) {
    await buildPackages(packages.npm);
    logAsSection('[x] Build for NPM');
    const distTag = channel === 'prod' ? 'latest' : 'next';
    await publishPackages(packages.npm, distTag);
    logAsSection('[x] Publish on NPM');
  }

  // 4. Publish to Vercel
  if (packages.vercel.length) {
    // TODO: This is not a good solution, because it will build the package itself twice.
    await buildPackages(packages.vercel).catch((e) => {
      console.log('[-] BUILD FAILED. Ignore it to workflow run the rest of tasks.');
      console.log(e);
    });
    logAsSection('[x] Build for VERCEL');
    await deployProjectsToVercel(packages.vercel).catch((e) => {
      console.log('[-] DEPLOY FAILED. Ignore it to workflow run the rest of tasks.');
      console.log(e);
    });
    logAsSection('[x] Deploy to VERCEL');
  }

  // 6. Yarn upgrade-all
  await execa('yarn', ['upgrade-all', changedPkg.name]);
  logAsSection('[x] Upgrade all package users.');

  return updatedPackages[0];
}
