#!/usr/bin/env node
'use strict';

import commandLineArgs from 'command-line-args';
import {
  getInfoBeforeGeneratingChangelog,
  generateChangelogAndSave,
  generateChangelogAndPrint,
} from '../common/changelog.mjs';
import {
  workspacePackages,
  packageNamesToPackagesWithInfo,
} from '../common/utils.mjs';

async function generateChangelogForRoot(options) {
  const { from, commitsCount } = await getInfoBeforeGeneratingChangelog();

  if (commitsCount > 0) {
    console.log('from:', from || 'start (first release)');
    console.log('commits:', commitsCount);

    if (options.save) {
      await generateChangelogAndSave();
    } else {
      generateChangelogAndPrint();
    }
  } else {
    console.log(`No commits found, skipping changelog generation.`);
  }
}

async function generateChangelogForWorkspaceMembers(pkgs, options) {
  for (const pkg of pkgs) {
    const { from, commitsCount } = await getInfoBeforeGeneratingChangelog(pkg);

    if (commitsCount > 0) {
      console.log('name:', pkg.name);
      console.log('from:', from || 'start (first release)');
      console.log('commits:', commitsCount);

      if (options.save) {
        await generateChangelogAndSave(pkg);
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

// NOTE 1: changelog should be run before the tagging proccess for the new release. checkout the steps here: https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog#recommended-workflow
// NOTE 2: we use tags. tags with package@semver format.
// NOTE 3: when don't use any flag, we will last valid tag as starting point.
async function run() {
  const optionDefinitions = [
    { name: 'name', type: String },
    { name: 'save', type: Boolean },
    { name: 'all', type: Boolean },
  ];
  const { name, save, all } = commandLineArgs(optionDefinitions);

  if (name && all)
    throw new Error('One of the --name or --all flag should be given');

  if (name || all) {
    // Create a list of packages we are going to create changelog for.
    const pkgs = [];
    if (name) {
      const workspacePkgs = await packageNamesToPackagesWithInfo([name]);
      if (workspacePkgs.length !== 1)
        throw new Error('Your provided package is not found.', {
          cause: workspacePkgs,
        });

      pkgs.push(workspacePkgs[0]);
    } else {
      const list = await workspacePackages();
      list
        .filter((pkg) => !pkg.private)
        .forEach((pkg) => {
          pkgs.push(pkg);
        });
    }

    await generateChangelogForWorkspaceMembers(pkgs, {
      save,
    });
  } else {
    await generateChangelogForRoot({
      save,
    });
  }
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
