import { packageNameWithoutScope } from './utils.mjs';
import { ConventionalChangelog } from 'conventional-changelog';
import { ConventionalGitClient } from '@conventional-changelog/git-client';
import { WriteStream } from 'node:fs';
import fs from 'node:fs';
import path from 'node:path';

// Our tagging is using lerna convention which is package-name@version
// for example for @rango-dev/wallets-core, it will be wallets-core@1.1.0
const TAG_PACKAGE_PREFIX = (pkg) => `${packageNameWithoutScope(pkg.name)}@`;
const TAG_ROOT_PREFIX = /^[^@]+@/;

// TODO: this is not correct assumption that the script will be run from the root.
// I made it a function to make it easier correct behaviour in future.
function rootPath() {
  return path.join('.');
}
function rootPackageJson() {
  return path.join(rootPath(), 'package.json');
}

/**
 * Retrieving some useful information when you are going to generate a changelog
 *
 * @param {import("./typedefs.mjs").Package} [pkg]
 */
export async function getInfoBeforeGeneratingChangelog(pkg) {
  const gitClient = new ConventionalGitClient(process.cwd());

  let commitsParams = {
    merges: false,
  };

  let startFromTag = undefined;
  if (pkg) {
    const tagsParams = {
      prefix: TAG_PACKAGE_PREFIX(pkg),
    };
    const semverTagsStream = gitClient.getSemverTags(tagsParams);

    const semverTags = [];
    for await (const tag of semverTagsStream) {
      semverTags.push(tag);
    }
    startFromTag = semverTags[0];

    commitsParams = {
      ...commitsParams,
      from: startFromTag,
      path: pkg.location,
    };
  } else {
    const semverTag = await gitClient.getLastSemverTag({
      // HEADS UP:
      // The following regex pattern supports the `package@1.1.1` format, which meets our needs for now.
      // scoped tags like `@a/b@1.1.1` are not currently supported.
      prefix: TAG_ROOT_PREFIX,
    });
    // If there are no semver tags, null is returned. In that case, we change it undefined to match the `string | undefined` signature.
    startFromTag = semverTag || undefined;

    if (startFromTag) {
      commitsParams = {
        ...commitsParams,
        from: startFromTag,
      };
    }
  }

  const commitsStream = gitClient.getCommits(commitsParams);

  const commits = [];
  for await (const commit of commitsStream) {
    commits.push(commit);
  }

  return {
    /** Where is considering as starting point, it is genrally a tag. undefined means it's the first release.'*/
    from: startFromTag,
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
 *
 * Generate a changelog by using convetional commit format.
 * It uses tags to identify releases.
 *
 * @param {import("./typedefs.mjs").Package} [pkg]
 * @returns {ReadableStream}
 */
export function generateChangelog(pkg) {
  const generator = new ConventionalChangelog(process.cwd());
  generator.loadPreset('angular');

  if (pkg) {
    generator.readPackage(`${pkg.location}/package.json`);
    generator.commits({
      path: pkg.location,
    });

    generator.tags({
      prefix: TAG_PACKAGE_PREFIX(pkg),
    });
  } else {
    generator.readPackage(rootPackageJson());
    generator.tags({
      prefix: TAG_ROOT_PREFIX,
    });
  }

  return generator.writeStream();
}

/**
 *
 * @param {import("./typedefs.mjs").Package} [pkg]
 */
export function generateChangelogAndSave(pkg) {
  const changelog = generateChangelog(pkg);

  // we only need location for file stream, when pkg is undefined, we will point to root package.json
  if (!pkg) pkg = { location: rootPath() };
  changelog.pipe(changelogFileStream(pkg));
}

/**
 *
 * @param {import("./typedefs.mjs").Package} [pkg]
 */
export function generateChangelogAndPrint(pkg) {
  const changelog = generateChangelog(pkg);
  changelog.pipe(process.stdout);
}
