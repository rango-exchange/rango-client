#!/usr/bin/env node
'use strict';
import process from 'node:process';

import {
  changed,
  detectChannel,
  exportNx,
  getLastReleasedHashId,
  logAsSection,
  pushToRemote,
  tagPackagesAndCommit,
} from './utils.mjs';
import { Graph } from '../common/graph/index.mjs';
import { nxToGraph } from '../common/graph/helpers.mjs';
import { $ } from 'execa';
import { performance } from 'node:perf_hooks';
import { packageNamesToPackagesWithInfo } from '../common/utils.mjs';
import { publish } from './single-pkg-publish.mjs';

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
