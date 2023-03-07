#!/usr/bin/env node
'use strict';

import {
  buildPackages,
  changed,
  deployProjectsToVercel,
  detectChannel,
  getLastTagHashId,
  groupPackagesForDeploy,
  increaseVersionForNext,
  logAsSection,
  publishPackages,
  pushToRemote,
  tagPackages,
} from './utils.mjs';

// TODO: Working directory should be empty.
async function run() {
  // Detect last relase and what packages has changed since then.
  const baseCommit = await getLastTagHashId();
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

  // Run a specific workflow based on channel
  const channel = detectChannel();
  if (channel === 'next') {
    await publishNext(changedPkgs);
  } else {
    throw new Error('Channel not detected');
  }
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});

/* -------------- Flows ------------------ */

async function publishNext(changedPkgs) {
  // Versioning
  logAsSection(`Versioning, Start...`, `for ${changedPkgs.length} packages`);
  const updatedPackages = await increaseVersionForNext(changedPkgs);

  logAsSection(`Versioning, Done.`);
  console.log(
    updatedPackages.map((pkg) => `- ${pkg.name} (next version: ${pkg.version})`).join('\n'),
  );

  logAsSection(`Tagging, Start...`, `for ${updatedPackages.length} packages`);
  const taggedPackages = await tagPackages(updatedPackages);
  logAsSection(`Tagging, Done.`);
  console.log({ taggedPackages });

  logAsSection(`Pushing tags to remote...`);
  await pushToRemote('next');
  logAsSection(`Pushed.`);

  // Publish to NPM
  const packages = groupPackagesForDeploy(updatedPackages);

  logAsSection(`It's time for building artifacts...`);
  console.log({ packages });

  if (packages.npm.length) {
    logAsSection('NPM Build', `Build npm packages...`);
    await buildPackages(packages.npm);
    logAsSection('NPM Build', `Successfully built.`);
    logAsSection('NPM Publish', 'Publishing npm packages....');
    await publishPackages(packages.npm);
    logAsSection('NPM Publish', 'Published. Congrats 🎉');
  }

  // Publish to Vercel
  if (packages.vercel.length) {
    logAsSection(`Build clients & deploy to vercel...`);
    await deployProjectsToVercel(packages.vercel);
    logAsSection(`We are good. Done.`);
  }
}
