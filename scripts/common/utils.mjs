import path from 'path';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';
import { join } from 'path';
import { execa } from 'execa';

const root = join(printDirname(), '..', '..');

export function printDirname() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  return __dirname;
}

export async function workspacePackages() {
  const { stdout } = await execa('yarn', ['workspaces', 'info']);
  const result = JSON.parse(stdout);
  const packagesName = Object.keys(result);
  const output = packagesName.map((name) => {
    const pkgJson = pacakgeJson(result[name].location);
    return {
      name,
      location: result[name].location,
      version: pkgJson.version,
      private: pkgJson.private || false,
    };
  });
  return output;
}

export function pacakgeJson(location) {
  const fullPath = join(root, location, 'package.json');
  const file = readFileSync(fullPath);
  return JSON.parse(file);
}

export async function packageNamesToPackagesWithInfo(names) {
  const allPackages = await workspacePackages();
  return names.map((pkgName) => allPackages.find((pkg) => pkg.name === pkgName));
}

/*
  Convert:
  @hello-wrold/a-b -> a-b
*/
export function packageNameWithoutScope(name) {
  return name.replace(/@.+\//, '');
}
