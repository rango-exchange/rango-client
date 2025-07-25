#!/usr/bin/env node
'use strict';

import { discoverWorkspacePackages } from '../common/repository.mjs';
import commandLineArgs from 'command-line-args';
import {
  generateChangelog,
  getInfoBeforeGeneratingChangelog,
  changelogFileStream,
  generateChangelogAndSave,
  generateChangelogAndPrint,
} from '../common/changelog.mjs';
import {
  workspacePackages,
  packageNamesToPackagesWithInfo,
} from '../common/utils.mjs';

// NOTE: changelog should be run before the tagging proccess for the new release.

// TODO: Add single repo flow for genrating changelog, the whole assumption here is we are in a monorepo.
async function run() {
  const optionDefinitions = [
    { name: 'name', type: String },
    { name: 'save', type: Boolean },
  ];
  const { name, save } = commandLineArgs(optionDefinitions);

  // Create a list of packages we are going to create changelog for.
  const packages = [];
  if (name) {
    const pkgs = await packageNamesToPackagesWithInfo([name]);
    if (pkgs.length !== 1)
      throw new Error('Your provided package is not found.', { cause: pkgs });

    packages.push(pkgs[0]);
  } else {
    console.warn(
      "You didn't specify any package name, so we will consider this as all the public packages should be considered."
    );

    const list = await workspacePackages();
    list
      .filter((pkg) => !pkg.private)
      .forEach((pkg) => {
        packages.push(pkg);
      });
  }

  // Try generate changelog for each of them.
  for (const pkg of packages) {
    const { from, commitsCount } = await getInfoBeforeGeneratingChangelog(pkg);

    if (commitsCount > 0) {
      console.log('name:', pkg.name);
      console.log('from:', from || 'start (first release)');
      console.log('commits:', commitsCount);

      if (save) {
        generateChangelogAndSave(pkg);
      } else {
        generateChangelogAndPrint(pkg);
      }
    } else {
      console.log(
        `No commits found for ${pkg.name}, skipping changelog generation.`
      );
    }
  }
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
