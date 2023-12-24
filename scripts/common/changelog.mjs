import { execa } from 'execa';
import { GenerateChangelogFailedError, YarnError } from './errors.mjs';
import { packageNameWithoutScope } from './utils.mjs';

/**
 * Generate a changelog by using convetional commit format.
 *
 * @param {import("./typedefs.mjs").Package} pkg
 * @param {Object} options
 * @param {boolean} options.saveToFile `true` for using it for creating `pkg/CHANGELOG.com` and `false` for Github Release note.
 */
export async function generateChangelog(pkg, options) {
  const { saveToFile = false } = options || {};

  const conventionalChangelogBinPath = await execa('yarn', [
    'bin',
    'conventional-changelog',
  ])
    .then((result) => result.stdout)
    .catch((err) => {
      throw new YarnError(`GetBinaryPathFailed: \n${err.stdout}`);
    });

  const tagName = packageNameWithoutScope(pkg.name);
  const command = [
    'conventional-changelog',
    '-p',
    'angular',
    '-l',
    `${tagName}`,
    '-k',
    pkg.location,
    '--commit-path',
    pkg.location,
  ];

  if (saveToFile) {
    const changelogPath = `${pkg.location}/CHANGELOG.md`;
    command.push('-i', changelogPath, '-s');
  }

  const result = await execa(conventionalChangelogBinPath, command)
    .then((result) => result.stdout)
    .catch((err) => {
      throw new GenerateChangelogFailedError(err.stdout);
    });

  return result;
}
