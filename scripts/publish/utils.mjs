import chalk from 'chalk';
import { UnableToProceedPublishError } from '../common/errors.mjs';
import { should } from '../common/features.mjs';
import { addFileToStage } from '../common/git.mjs';
import { detectChannel } from '../common/github.mjs';

/**
 *
 * For publishing a package we are changing somefiles,
 * using this function it helps to add them git staging area.
 *
 * @param {import('../common/typedefs.mjs').Package} pkg
 */
export async function addPkgFileChangesToStage(pkg) {
  await addFileToStage(`${pkg.location}/package.json`);
  if (should('generateChangelog')) {
    await addFileToStage(`${pkg.location}/CHANGELOG.md`);
  }
}

/**
 * Getting a list of (lazy) promises and run them one after another.
 * @param {Promise[]} promises
 * @returns {Promise<Array>}
 */
export async function sequentiallyRun(promises) {
  return promises.reduce((prev, task) => {
    return prev.then(() => {
      return task();
    });
  }, Promise.resolve());
}

export function logAsSection(title, sub = '') {
  let message = chalk.bgBlue.white.bold(title);
  if (!!sub) {
    message += ' ';
    message += sub;
  }
  console.log(message);
}

/**
 * Get state and check some conditions on the state to make sure we can publish.
 *
 * @param {import('./typedefs.mjs').PackageState[]} pkgsState
 */
export function throwIfUnableToProceed(pkgsState) {
  const channel = detectChannel();

  if (channel === 'prod') {
    // TODO: it's better to check `npm` version should be less than `package.version`
    const alreadyPublishedPackages = pkgsState.filter(
      (pkgState) => pkgState.version === pkgState.npmVersion
    );
    const alreadyHasGithubReleasePackages = pkgsState.filter(
      (pkgState) => !!pkgState.githubRelease
    );
    const alreadyHasGitTagPackages = pkgsState.filter(
      (pkgState) => !!pkgState.gitTag
    );

    if (alreadyPublishedPackages.length) {
      const list = alreadyPublishedPackages
        .map((pkg) => pkg.npmVersion)
        .join(',');
      throw new UnableToProceedPublishError(
        `These versions have been published on NPM already. \n ${list}`
      );
    } else if (alreadyHasGithubReleasePackages.length) {
      const list = alreadyHasGithubReleasePackages
        .map((pkg) => pkg.githubRelease)
        .join(',');
      throw new UnableToProceedPublishError(
        `These versions have been released on Github before. \n ${list}`
      );
    } else if (alreadyHasGitTagPackages.length) {
      const list = alreadyHasGithubReleasePackages
        .map((pkg) => pkg.gitTag)
        .join(',');
      throw new UnableToProceedPublishError(
        `These tags already exist. \n ${list}`
      );
    }
  }
}
