import { packageNameWithoutScope } from './utils.mjs';
import { ConventionalChangelog } from 'conventional-changelog';
import { ConventionalGitClient } from '@conventional-changelog/git-client';
import { createWriteStream, createReadStream, WriteStream } from 'node:fs';
import fs from 'node:fs';
import path from 'node:path';
import { pipeline } from 'node:stream/promises';
import { rename, unlink, access } from 'node:fs/promises';

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
  const changelogPathTmp = changelogPath + '.tmp';

  // Creating a temp writer to don't load the whole file in memory at once, at the end will append the old changelog to the temp, then rename it.
  const tempWriteStream = createWriteStream(changelogPathTmp);

  tempWriteStream.on('finish', async () => {
    try {
      // if a changelog already exists, we append the old one top the temp.
      await access(changelogPath)
        .then(() =>
          pipeline(
            createReadStream(changelogPath),
            createWriteStream(changelogPathTmp, { flags: 'a' })
          )
        )
        .catch(() => {
          // ignore.
        });

      // replace temp as the main changelog.
      await rename(changelogPathTmp, changelogPath);
    } catch (err) {
      console.error('Failed to prepend changelog:', { err });
      void unlink(changelogPathTmp);
    }
  });

  return tempWriteStream;
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
export async function generateChangelogAndSave(pkg) {
  return new Promise((resolve, reject) => {
    const changelog = generateChangelog(pkg);

    // we only need location for file stream, when pkg is undefined, we will point to root package.json
    if (!pkg) pkg = { location: rootPath() };

    const writeStream = changelog.pipe(changelogFileStream(pkg));

    writeStream.on('finish', resolve);
    writeStream.on('error', reject);
  });
}

/**
 *
 * @param {import("./typedefs.mjs").Package} [pkg]
 */
export function generateChangelogAndPrint(pkg) {
  const changelog = generateChangelog(pkg);
  changelog.pipe(process.stdout);
}
