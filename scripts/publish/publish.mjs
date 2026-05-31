import chalk from 'chalk';
import { generateChangelogAndSave } from '../common/changelog.mjs';
import { should } from '../common/features.mjs';
import { publishOnNpm } from '../common/npm.mjs';
import { addPkgFileChangesToStage, sequentiallyRun } from './utils.mjs';

/**
 * By giving a list of packages, we will try to publish all of them sequentially.
 * Dependent upgrades are expected to have already been applied before calling this
 * (see `upgradeAllDependents` in upgrade.mjs), so this function only handles
 * npm publish → changelog → git staging.
 *
 * @param {import("../common/utils.mjs").Package[]} pkgs
 * @param {{ onUpdateState: (name: string, key: string, value: string) => void }} options
 */
export async function tryPublish(pkgs, { onUpdateState }) {
  const tasks = pkgs.map(
    (pkg) => () =>
      publishTask(pkg, { onUpdateState }).catch((e) => {
        e.cause = { pkg };
        throw e;
      })
  );
  await sequentiallyRun(tasks);

  console.log(`Published.`);
}

/**
 * Executes all steps required to publish a single package:
 *   1. Publish to npm
 *   2. Generate changelog (if enabled)
 *   3. Stage changed files for git commit
 *
 * Note: dependent package.json upgrades are intentionally excluded here.
 * They are performed in bulk via `upgradeAllDependents` in command.mjs
 * *before* the Nx build step so that Nx picks up the correct versions.
 *
 * @param {import('../common/typedefs.mjs').Package} pkg
 * @param {{ onUpdateState: (name: string, key: string, value: string) => void }} options
 */
async function publishTask(pkg, { onUpdateState }) {
  console.log(chalk.green('[1/3]'), `Publish ${pkg.name} to npm`);
  await publishOnNpm(pkg);
  onUpdateState(pkg.name, 'npmVersion', pkg.version);

  if (should('generateChangelog')) {
    console.log(chalk.green('[2/3]'), `Making changelog`);
    await generateChangelogAndSave(pkg);
  } else {
    console.log(chalk.green('[2/3]'), `Skipping changelog and github release.`);
  }

  console.log(chalk.green('[3/3]'), `Adding files to staging area`);
  await addPkgFileChangesToStage(pkg);

  console.log(`🚀 ${pkg.name} published.`);
}