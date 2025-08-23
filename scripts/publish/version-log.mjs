import { packageChangelogPath, packageJsonPath } from '../common/path.mjs';
import { generateChangelogAndSave } from '../common/changelog.mjs';

import chalk from 'chalk';
import { should } from '../common/features.mjs';
import { addFileToStage, makeCommit } from '../common/git.mjs';
import { ROOT_VERSIONS_COMMIT_SUBJECT } from '../common/constants.mjs';
import { increaseVersionForProd } from '../common/version.mjs';
import { workspacePackages } from '../common/utils.mjs';

import {
  PLAYGROUND_PACKAGE_NAME,
  WIDGET_APP_PACKAGE_NAME,
} from '../deploy/config.mjs';

async function generateRootChangelog() {
  console.log(`Making root changelog...`);
  await generateChangelogAndSave();
  await addFileToStage(packageChangelogPath());
}

async function bumpVersions() {
  const pkgs = await workspacePackages();
  await increaseVersionForProd();
  await addFileToStage(packageJsonPath());

  const widgetAppPackage = pkgs.find(
    (pkg) => pkg.name === WIDGET_APP_PACKAGE_NAME
  );
  await increaseVersionForProd(widgetAppPackage);
  await addFileToStage(packageJsonPath(widgetAppPackage.location));

  const playgroundPackage = pkgs.find(
    (pkg) => pkg.name === PLAYGROUND_PACKAGE_NAME
  );
  await increaseVersionForProd(playgroundPackage);
  await addFileToStage(packageJsonPath(playgroundPackage.location));
}

export async function bumpClientAndRootVersionsAndGenerateRootChangelog() {
  if (should('generateChangelog')) {
    console.log(chalk.green('[1/3]'), `Bump versions`);
    await bumpVersions();

    console.log(chalk.green('[2/3]'), `Generate root changelog`);
    await generateRootChangelog();

    console.log(chalk.green('[3/3]'), `Commit changes`);
    await makeCommit([ROOT_VERSIONS_COMMIT_SUBJECT], {
      shouldSkipCI: true,
      // If ESLint fails, it will break our workflow, so it has been turned off to avoid checking files.
      shouldVerify: false,
    });
  } else {
    console.log('Skipping root changelog and versioning...');
  }
}
