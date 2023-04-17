#!/usr/bin/env node
'use strict';

import {
  buildPackages,
  changed,
  deployProjectsToVercel,
  detectChannel,
  getLastReleasedHashId,
  groupPackagesForDeploy,
  increaseVersionForMain,
  increaseVersionForNext,
  logAsSection,
  publishPackages,
  pushToRemote,
  tagPackages,
} from './utils.mjs';

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

  // Run a specific workflow based on channel
  await publish(changedPkgs, channel);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});

/* -------------- Flows ------------------ */

async function publish(changedPkgs, channel) {
  // Versioning
  logAsSection(`Versioning, Start...`, `for ${changedPkgs.length} packages`);

  let updatedPackages;
  if (channel === 'prod') {
    updatedPackages = await increaseVersionForMain(changedPkgs);
  } else {
    updatedPackages = await increaseVersionForNext(changedPkgs);
  }

  logAsSection(`Versioning, Done.`);
  console.log(
    updatedPackages.map((pkg) => `- ${pkg.name} (next version: ${pkg.version})`).join('\n'),
  );

  logAsSection(`Tagging, Start...`, `for ${updatedPackages.length} packages`);
  const tagOptions = channel === 'prod' ? { skipGitTagging: false } : { skipGitTagging: true };
  const taggedPackages = await tagPackages(updatedPackages, tagOptions);
  logAsSection(`Tagging, Done.`);
  console.log({ taggedPackages });

  logAsSection(`Pushing tags to remote...`);
  const branch = channel === 'prod' ? 'main' : 'next';
  await pushToRemote(branch);
  logAsSection(`Pushed.`);

  // Publish to NPM
  const packages = groupPackagesForDeploy(updatedPackages);

  logAsSection(`It's time for building artifacts...`);

  if (packages.npm.length) {
    logAsSection('NPM Build', `Build npm packages...`);
    await buildPackages(packages.npm);
    logAsSection('NPM Build', `Successfully built.`);
    logAsSection('NPM Publish', 'Publishing npm packages....');
    const distTag = channel === 'prod' ? 'latest' : 'next';
    await publishPackages(packages.npm, distTag);
    logAsSection('NPM Publish', 'Published. Congrats 🎉');
  }

  // Publish to Vercel
  if (packages.vercel.length) {
    logAsSection(`Build clients & deploy to vercel...`);
    // TODO: This is not a good solution, because it will build the package itself twice.
    await buildPackages(packages.vercel);
    logAsSection('Dependency', `Successfully built.`);
    await deployProjectsToVercel(packages.vercel);
    logAsSection(`We are good. Done.`);
  }
}
