import path from 'node:path';
import { fileURLToPath } from 'node:url';

function printDirname() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  return __dirname;
}

/**
 * Returns the root path of the project.
 *
 *
 * @returns {string} The path to the project root (currently returns '.')
 */
export function rootPath() {
  return path.join(printDirname(), '..', '..');
}


/**
 * Returns the full path of a package including the root path.
 * If no package location is provided, returns the root path.
 *
 * @param {string} [packageLocation=''] - The relative path to the package from root
 * @returns {string} The full path to the package directory
 * @example
 * // Returns root path
 * packagePath()
 *
 */
export function packagePath(packageLocation = '') {
  return path.join(rootPath(), packageLocation);
}

/**
 * Returns the full path to the package.json file of a package.
 * If no package location is provided, returns the root package.json path.
 *
 * @param {string} [packageLocation=''] - The relative path to the package from root
 * @returns {string} The full path to the package.json file
 * @example
 * // Returns './package.json'
 * packageJsonPath()
 *
 */
export function packageJsonPath(packageLocation = '') {
  return path.join(packagePath(packageLocation), 'package.json');
}

/**
 * Returns the full path to the CHANGELOG.md file of a package.
 * If no package location is provided, returns the root CHANGELOG.md path.
 *
 * @param {string} [packageLocation=''] - The relative path to the package from root
 * @returns {string} The full path to the CHANGELOG.md file
 * @example
 * // Returns './CHANGELOG.md'
 * packageChangelogPath()
 *
 */
export function packageChangelogPath(packageLocation = '') {
  return path.join(packagePath(packageLocation), 'CHANGELOG.md');
}
