import fs from 'node:fs/promises';
import { $ } from 'execa';
import { join } from 'node:path';
import { printDirname } from '../common/utils.mjs';
import { compareSemVer } from 'semver-parser';

const cwd = join(printDirname(), '..', '..');

export async function packagePath(project) {
  const { stdout: info } = await $`yarn workspaces info`;
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

export async function packageVersionOnNPM(project, dist) {
  const { content, update } = await readPackageJson(project);
  const local_version = content.version;

  if (content.private) {
    console.log(`[info] local_version as npm_version because it is a private package.`);
    return {
      npm_version: local_version,
      local_version,
    };
  }

  // Continue if it's not a private package.
  const { stdout: npmInfo } = await $`yarn info ${project}@${dist} --json`;
  const versions = JSON.parse(npmInfo).data['dist-tags'];

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
        latest_version,
      )} cond: ${compareSemVer(dist_version, latest_version) > 0} `,
    );
    // compareSemVer returns 1 if dist_version is greater than latest_version.
    if (compareSemVer(dist_version, latest_version) > 0) {
      npm_version = dist_version;
    } else {
      console.log(
        `[info] latest version: ${latest_version}, ${dist} version: ${dist_version}. we use latest version because it's greater that ${dist_version}`,
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

export async function overrideNPMVersionOnLocal(project, dist) {
  const versions = await packageVersionOnNPM(project, dist);

  if (versions.npm_version !== versions.local_version) {
    console.log(`::warning::Mismatch version on local and npm for ${project}`);
    console.log(`${JSON.stringify(versions)}`);
  }

  return versions;
}
