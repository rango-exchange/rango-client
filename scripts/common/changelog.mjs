import { packageNameWithoutScope } from './utils.mjs';
import { ConventionalChangelog } from 'conventional-changelog';
import { ConventionalGitClient } from '@conventional-changelog/git-client';
import { WriteStream } from 'node:fs';
import fs from 'node:fs';
import path from 'node:path';

/**
 * Retrieving some useful information when you are going to generate a changelog
 *
 * @param {import("./typedefs.mjs").Package} pkg
 */
export async function getInfoBeforeGeneratingChangelog(pkg) {
  const gitClient = new ConventionalGitClient(process.cwd());
  const tagsParams = {
    prefix: `${packageNameWithoutScope(pkg.name)}@`,
  };
  const semverTagsStream = gitClient.getSemverTags(tagsParams);
  const semverTags = [];
  for await (const tag of semverTagsStream) {
    semverTags.push(tag);
  }

  const commitsParams = {
    merges: false,
    from: semverTags[0],
    path: pkg.location,
  };
  const commitsStream = gitClient.getCommits(commitsParams);

  const commits = [];
  for await (const commit of commitsStream) {
    commits.push(commit);
  }

  return {
    /** Where is considering as starting point, it is genrally a tag. undefined means it's the first release.'*/
    from: semverTags[0],
    /** How many commits this release has. */
    commitsCount: commits.length,
  };
}

/**
 * Create a write stream for the target package's changelog.
 *
 * @param {import("./typedefs.mjs").Package} pkg
 * @returns {WriteStream}
 */
export function changelogFileStream(pkg) {
  const changelogPath = path.join(pkg.location, 'CHANGELOG.md');
  const file = fs.createWriteStream(changelogPath, {
    encoding: 'utf-8',
    flags: 'a',
  });

  return file;
}

/**
 * Generate a changelog by using convetional commit format.
 * It uses tags to identify releases.
 *
 * @param {import("./typedefs.mjs").Package} pkg
 * @returns {WriteStream}
 */
export async function generateChangelog(pkg) {
  const generator = new ConventionalChangelog(process.cwd());
  // TODO: idk why without .json at the was working before
  generator.readPackage(`${pkg.location}/package.json`);
  generator.loadPreset('angular');

  let commitsOptions = {
    path: pkg.location,
  };

  // Our tagging is using lerna convention which is package-name@version
  // for example for @rango-dev/wallets-core, it will be wallets-core@1.1.0
  const tagName = packageNameWithoutScope(pkg.name);
  generator.tags({
    prefix: `${tagName}@`,
  });
  generator.commits(commitsOptions);

  return generator.writeStream();
}

export function generateChangelogAndSave(pkg) {
  const changelog = generateChangelog(pkg);
  changelog.pipe(changelogFileStream(pkg));
}

export function generateChangelogAndPrint(pkg) {
  const changelog = generateChangelog(pkg);
  changelog.pipe(process.stdout);
}
