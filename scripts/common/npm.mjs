import fs from 'node:fs/promises';
import { $, execa } from 'execa';
import { join } from 'node:path';
import { printDirname } from '../common/utils.mjs';
import { compareSemVer } from 'semver-parser';
import fetch, { Headers } from 'node-fetch';
import {
  NpmGetPackageError,
  NpmPackageNotFoundError,
  NpmPublishError,
  YarnError,
} from './errors.mjs';
import { detectChannel } from './github.mjs';

const cwd = join(printDirname(), '..', '..');

/**
 * Publish a package using `yarn publish`
 *
 * @param {import('../common/utils.mjs').Package} pkg
 */
export async function publishOnNpm(pkg) {
  const channel = detectChannel();
  const distTag = channel === 'prod' ? 'latest' : channel;
  const output = await execa('yarn', [
    'publish',
    pkg.location,
    '--tag',
    distTag,
  ])
    .then(({ stdout }) => stdout)
    .catch((error) => {
      throw new NpmPublishError(error.stderr);
    });

  return output;
}

/**
 * Accept a package and send a request to npm registry for getting information.
 *
 * @param {import('./typedefs.mjs').Package} pkg
 * @returns {Promise<import('./typedefs.mjs').NpmVersions>}
 */
export async function getNpmPackage(pkg) {
  const packageName = pkg.name;
  const headers = new Headers();
  // This is to use less bandwidth unless we really need to get the full response.
  // See https://github.com/npm/npm-registry-client#request
  headers.append(
    'Accept',
    'application/vnd.npm.install-v1+json; q=1.0, application/json; q=0.8, */*'
  );
  const response = await fetch(
    `https://registry.npmjs.org/${escapeName(packageName)}`,
    {
      headers,
    }
  ).catch((err) => {
    const msg =
      err.message || 'An error has occured when trying to get npm package.';
    throw new NpmGetPackageError(msg);
  });

  const body = await response.json();

  // A new package which never has been published on npm.
  if (response.status === 404) {
    throw new NpmPackageNotFoundError(packageName);
  } else if (response.status > 300) {
    const msg = `Package: ${packageName}, Status: ${response.status}, Body: ${body}`;
    throw new NpmGetPackageError(msg);
  }

  const versions = {
    next: body['dist-tags'].next || null,
    prod: body['dist-tags'].latest || null,
  };

  return versions;
}

/**
 * Getting version from NPM
 * returns null if found anything.
 *
 * @param {import('./typedefs.mjs').Package} pkg
 * @returns {Promise<import('./typedefs.mjs').NpmVersions | null>}
 */
export async function npmVersionFor(pkg) {
  try {
    const npmVersions = await getNpmPackage(pkg);
    return npmVersions;
  } catch (err) {
    if (err instanceof NpmPackageNotFoundError) {
      return null;
    }

    throw err;
  }
}

export async function packagePath(project) {
  const { stdout: info } = await $`yarn workspaces info`.catch((error) => {
    throw new YarnError(`'yarn workspaces info' failed. \n ${error.stderr}`);
  });
  const workspaces = JSON.parse(info);
  const pkg = workspaces[project];
  const path = pkg.location;

  return join(cwd, path);
}

export async function readPackageJson(project) {
  const pkgJsonPath = join(await packagePath(project), 'package.json');
  const pkgJsonFile = await fs.readFile(pkgJsonPath, { encoding: 'utf8' });
  const pkgJson = JSON.parse(pkgJsonFile);
  return {
    content: pkgJson,
    update: (newContent) => {
      return fs.writeFile(pkgJsonPath, JSON.stringify(newContent, null, 2));
    },
  };
}

async function requestNpmPackageInfo(name) {
  const headers = new Headers();
  // This is to use less bandwidth unless we really need to get the full response.
  // See https://github.com/npm/npm-registry-client#request
  headers.append(
    'Accept',
    'application/vnd.npm.install-v1+json; q=1.0, application/json; q=0.8, */*'
  );
  const res = await fetch(`https://registry.npmjs.org/${escapeName(name)}`, {
    headers,
  });
  const body = await res.json();

  return {
    status: res.status,
    body,
  };
}

export async function packageVersionOnNPM(project, dist) {
  const { content, update } = await readPackageJson(project);
  const local_version = content.version;

  if (content.private) {
    console.log(
      `::notice::considering npm_version same as local_version because it is a private package.`
    );
    return {
      npm_version: local_version,
      local_version,
    };
  }

  // Continue if it's not a private package.

  const { status, body } = await requestNpmPackageInfo(project).catch((e) => {
    console.log(`::error::npm_request_failed: ${e}`);
    throw new Error(e);
  });

  // A new package which never has been published on npm.
  if (status === 404) {
    console.log(
      `::notice::considering npm_version same as local_version because it is a new package.`
    );
    return {
      npm_version: local_version,
      local_version,
    };
  }

  const versions = body['dist-tags'];

  // Fallback to local version, if package isn't published on NPM yet.
  let npm_version = versions[dist] || local_version;

  // We should check if `latest` version is greater than `dist` version (next), use latest version instead.
  // Because it will get stuck on a version forever.
  console.log(`::debug::${dist} ${JSON.stringify(versions)}`);
  if (dist !== 'latest') {
    const latest_version = versions['latest'];
    const dist_version = versions[dist];

    console.log(
      `::debug::latest: ${latest_version}, dist: ${dist_version}, result: ${compareSemVer(
        dist_version,
        latest_version
      )} cond: ${compareSemVer(dist_version, latest_version) > 0} `
    );
    // compareSemVer returns 1 if dist_version is greater than latest_version.
    if (compareSemVer(dist_version, latest_version) > 0) {
      npm_version = dist_version;
    } else {
      console.log(
        `[info] latest version: ${latest_version}, ${dist} version: ${dist_version}. we use latest version because it's greater that ${dist_version}`
      );
      npm_version = latest_version;
    }
  }

  // update pkg json
  content.version = npm_version;
  await update(content);
  return {
    npm_version,
    local_version,
  };
}

function escapeName(name) {
  // scoped packages contain slashes and the npm registry expects them to be escaped
  return name.replace('/', '%2f');
}
