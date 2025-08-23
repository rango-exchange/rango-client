import path from 'node:path';

// TODO: this is not correct assumption that the script will be run from the root.
// I made it a function to make it easier correct behaviour in future.
function rootPath() {
  return path.join('.');
}
export function packagePath(packageLocation = '') {
  return path.join(rootPath(), packageLocation);
}
export function packageJsonPath(packageLocation = '') {
  return path.join(packagePath(packageLocation), 'package.json');
}
export function packageChangelogPath(packageLocation = '') {
  return path.join(packagePath(packageLocation), 'CHANGELOG.md');
}
