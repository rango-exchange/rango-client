import fs from 'node:fs/promises';
import { $ } from 'execa';
import { join } from 'node:path';
import { printDirname } from '../common/utils.mjs';

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
  let version;

  const { content, update } = await readPackageJson(project);
  const local_version = content.version;

  if (content.private) {
    console.log(`[info] local_version as npm_version because it is a private package.`);
    version = local_version;
  } else {
    const { stdout: npmInfo } = await $`yarn info ${project}@${dist} --json`;
    const versions = JSON.parse(npmInfo).data['dist-tags'];
    version = versions[dist];
  }

  // update pkg json
  content.version = version;
  await update(content);
  return {
    npm_version: version,
    local_version,
  };
}

export async function overrideNPMVersionOnLocal(project, dist) {
  const versions = await packageVersionOnNPM(project, dist);

  if (versions.npm_version !== versions.local_version) {
    console.log(`WARNING! Mismatch version on local and npm for ${project}`);
  }

  return versions;
}
