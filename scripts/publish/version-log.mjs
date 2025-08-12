import { generateChangelogAndSave } from '../common/changelog.mjs';
import path from 'node:path';
import chalk from 'chalk';
import { should } from '../common/features.mjs';
import { addFileToStage } from '../common/git.mjs';
import { ROOT_VERSIONS_COMMIT_SUBJECT } from '../common/constants.mjs';
import { execa } from 'execa';
import { GitError } from '../common/errors.mjs';
import {
  PLAYGROUND_PACKAGE_NAME,
  WIDGET_APP_PACKAGE_NAME,
} from '../deploy/config.mjs';
function rootPath() {
  return path.join('.');
}
function rootChangelogPath() {
  return path.join(rootPath(), 'CHANGELOG.md');
}
function rootPackageJsonPath() {
  return path.join(rootPath(), 'package.json');
}
function widgetAppPackageJsonPath() {
  return path.join(rootPath(), 'widget', 'app', 'package.json');
}
function playgroundPackageJsonPath() {
  return path.join(rootPath(), 'widget', 'playground', 'package.json');
}
async function generateRootChangelog() {
  console.log(`Making root changelog...`);
  await generateChangelogAndSave();
  await addFileToStage(rootChangelogPath());
}
async function commitChanges() {
  const message = `${ROOT_VERSIONS_COMMIT_SUBJECT}`;
  const body = '[skip ci]';

  console.log(`Committing root changelog...`);
  // Making a deploy commit
  await execa('git', ['commit', '-m', message, '-m', body]).catch((error) => {
    throw new GitError(`git commit failed. \n ${error.stderr}`);
  });
}
async function bumpVersions() {
  await bumpRootVersion();
  await addFileToStage(rootPackageJsonPath());
  await bumpPackageVersion(WIDGET_APP_PACKAGE_NAME);
  await addFileToStage(widgetAppPackageJsonPath());
  await bumpPackageVersion(PLAYGROUND_PACKAGE_NAME);
  await addFileToStage(playgroundPackageJsonPath());
}
async function bumpRootVersion() {
  return await execa('yarn', [
    'version',
    `--major`,
    '--no-git-tag-version',
    '--json',
  ]);
}
async function bumpPackageVersion(pkg) {
  return await execa('yarn', [
    'workspace',
    pkg,
    'version',
    `--minor`,
    '--no-git-tag-version',
    '--json',
  ]);
}
export async function versionLog() {
  if (should('generateChangelog')) {
    console.log(chalk.green('[1/3]'), `Bump versions`);
    await bumpVersions();
    console.log(chalk.green('[2/3]'), `Generate root changelog`);
    await generateRootChangelog();

    console.log(chalk.green('[3/3]'), `Commit changes`);
    await commitChanges();
  } else {
    console.log('Skipping root changelog and versioning...');
  }
}