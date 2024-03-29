import fs from 'node:fs/promises';
import { join } from 'node:path';
import { $ } from 'execa';
import { printDirname } from '../common/utils.mjs';
import { packageVersionOnNPM } from '../common/npm.mjs';

const cwd = join(printDirname(), '..', '..');

export async function updateVersion(target, upgrade) {
  const { path } = target;
  const { name, version } = upgrade;
  const pkgPath = join(cwd, path, 'package.json');

  const pkgJson = await fs.readFile(pkgPath, { encoding: 'utf8' });
  const updatedPkgJson = JSON.parse(pkgJson);
  if (updatedPkgJson['dependencies'][name]) {
    updatedPkgJson['dependencies'][name] = `^${version}`;
  } else if (updatedPkgJson['devDependencies'][name]) {
    updatedPkgJson['devDependencies'][name] = `^${version}`;
  } else {
    throw new Error(
      `${name} not found, neither dependencies or devDependencies.`
    );
  }

  await fs.writeFile(pkgPath, JSON.stringify(updatedPkgJson, null, 2));
}

export async function getAllPackages() {
  const { stdout: info } = await $`yarn workspaces info`;
  const workspaces = JSON.parse(info);
  const pkgs = Object.keys(workspaces);
  return pkgs;
}

/**
  By passing a project (package) name, this function will go through all workspace 
  and will upgrade the version if any package has `project` inside its `dependency` or `devDependency`. 

  @param version If set, it will use the passed version, if not, it will get the version from NPM. By default it's an empty string.
**/
export async function upgradeDepndendentsOf(project, dist, version) {
  const { stdout: info } = await $`yarn workspaces info`;
  const workspaces = JSON.parse(info);

  // Going through all workspace and find packages which depends on `project`
  const dependents = [];
  const pkgs = Object.keys(workspaces);
  pkgs.forEach((pkg) => {
    if (
      workspaces[pkg].workspaceDependencies.includes(project) ||
      workspaces[pkg].mismatchedWorkspaceDependencies.includes(project)
    ) {
      dependents.push(pkg);
    }
  });

  if (dependents.length === 0) {
    console.log(`It seems ${project} isn't used by any packages. Skip...`);
    return;
  }

  console.log(
    `These packages are using ${project}: ${dependents.join(',')} \n`
  );

  // If set, it will use the passed version, if not, it will get the version from NPM. By default it's an empty string.
  let project_version;
  if (!!version) {
    console.log(`Using fixed version for ${project} which is ${version}. \n`);
    project_version = version;
  } else {
    const versions = await packageVersionOnNPM(project, dist);
    console.log(`NPM version for ${project} is ${versions.npm_version}. \n`);
    project_version = versions.npm_version;
  }

  await Promise.all(
    dependents.map((pkg) =>
      updateVersion(
        { path: workspaces[pkg].location },
        { name: project, version: project_version }
      )
    )
  );
}
