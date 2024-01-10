import path from 'path';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';
import { join } from 'path';
import { execa } from 'execa';
import process from 'node:process';

const root = join(printDirname(), '..', '..');

export function printDirname() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  return __dirname;
}

/**
 * Getting workspace members using Yarn.
 *
 * @returns {Promise<import('./typedefs.mjs').Package[]>}
 */
export async function workspacePackages() {
  const { stdout } = await execa('yarn', ['workspaces', 'info']);
  const result = JSON.parse(stdout);
  const packagesName = Object.keys(result);
  const output = packagesName.map((name) => {
    const pkgJson = packageJson(result[name].location);
    return {
      name,
      location: result[name].location,
      version: pkgJson.version,
      private: pkgJson.private || false,
    };
  });
  return output;
}

/**
 * Getting a package json and deserialize it to JS object.
 * @param {string} location
 * @returns {Object}
 */
export function packageJson(location) {
  const fullPath = join(root, location, 'package.json');
  const file = readFileSync(fullPath);
  return JSON.parse(file);
}

/**
 * Getting a name and returns info related to that package name.
 *
 * @param {string[]} names Package names for getting information about.
 * @returns {Promise<import('./typedefs.mjs').Package[]>}
 */
export async function packageNamesToPackagesWithInfo(names) {
  const allPackages = await workspacePackages();
  const packages = [];
  names.forEach((pkgName) => {
    const packageInWorkspace = allPackages.find((pkg) => pkg.name === pkgName);
    if (!!packageInWorkspace) {
      packages.push(packageInWorkspace);
    }
  });

  return packages;
}

/**
 * Getting a package name (e.g. @hello-wrold/a-b) and get the name of pkg (e.g. a-b).
 *
 * @param {string} name
 */
export function packageNameWithoutScope(name) {
  return name.replace(/@.+\//, '');
}

/**
 * Note: we are adding a fallback, to make sure predefiend VERCEL_PACKAGES always will be true.
 *
 * @param {string} name enviroment variable name
 * @returns {string}
 */
export function getEnvWithFallback(name) {
  return process.env[name] || 'NOT SET';
}

/**
 *
 * @param {import('./typedefs.mjs').Package} pkg
 * @returns
 */
export function generateTagName(pkg) {
  return `${packageNameWithoutScope(pkg.name)}@${pkg.version}`;
}
