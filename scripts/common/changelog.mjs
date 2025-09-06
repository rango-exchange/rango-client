import { packageNameWithoutScope, packageJson } from './utils.mjs';
import { ConventionalChangelog } from 'conventional-changelog';
import { ConventionalGitClient } from '@conventional-changelog/git-client';
import { createWriteStream, createReadStream, WriteStream } from 'node:fs';
import path from 'node:path';
import { pipeline } from 'node:stream/promises';
import { rename, unlink, access } from 'node:fs/promises';
import { Writable } from 'stream';
import { packageJsonPath, packageChangelogPath, packagePath } from './path.mjs';

// Our tagging is using lerna convention which is package-name@version
// for example for @rango-dev/wallets-core, it will be wallets-core@1.1.0
export const TAG_PACKAGE_PREFIX = (pkg) =>
  `${packageNameWithoutScope(pkg.name)}@`;
const TAG_ROOT_PREFIX = /^[^@]+@/;

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
  const changelogPath = packageChangelogPath(pkg.location);
  const changelogPathTmp = changelogPath + '.tmp';

  // Creating a temp writer to don't load the whole file in memory at once, at the end will append the old changelog to the temp, then rename it.
  const tempWriteStream = createWriteStream(changelogPathTmp);

  const proxyStream = new Writable({
    write(chunk, encoding, cb) {
      tempWriteStream.write(chunk, encoding, cb);
    },
    final(cb) {
      tempWriteStream.end(async () => {
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

          cb();
        } catch (err) {
          console.error('Failed to prepend changelog:', { err });
          void unlink(changelogPathTmp);

          cb(err);
        }
      });
    },
  });

  return proxyStream;
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
    generator.readPackage(packageJsonPath(pkg.location));
    generator.commits({
      path: pkg.location,
    });

    generator.tags({
      prefix: TAG_PACKAGE_PREFIX(pkg),
    });
  } else {
    // TODO: sorry about this, we need to get embedded from yarn workspace. and also appending this "includes ..." should be a cli param somehow since it's specific to rango-client, and normal repos won't need that.
    let embeddedVersion;
    try {
      const json = packageJson(path.join('widget', 'embedded'));
      embeddedVersion = json.version;
    } catch {
      // ignore. in case of the target directory changed or doesn't exists.
    }

    /** @see https://github.com/conventional-changelog/conventional-changelog/blob/master/packages/conventional-changelog-writer/templates/header.hbs */
    let headerTemplate = `## {{#if isPatch~}} <small> {{~/if~}} {{#if title}}{{title}}{{/if}} [{{version}}] {{~#if date}} ({{date}}) {{~/if~}} {{~#if isPatch~}} </small> {{~/if}}`;
    if (embeddedVersion) {
      headerTemplate += `\n_includes \`@rango-dev/widget-embedded@${embeddedVersion}\`_`;
    }

    generator.readPackage(packageJsonPath());
    generator.context({
      // TODO: this shouldn't be hardcoded, we can use package.json's name field.
      // TODO: this is also a dirty way to know we are in rango-client or not. for other repos, we don't add any title.
      title: embeddedVersion ? 'Widget' : undefined,
    });

    generator.writer({
      headerPartial: headerTemplate,
    });
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

    // we only need location for file stream, when pkg is undefined, we will point to root of the project.
    // useful for creating root changelog for a monorepo, or for normal repos.
    if (!pkg) pkg = { location: packagePath() };

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
