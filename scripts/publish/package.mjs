import { should } from '../common/features.mjs';
import { gitTagFor } from '../common/git.mjs';
import { detectChannel, githubReleaseFor } from '../common/github.mjs';
import { npmVersionFor } from '../common/npm.mjs';
import {
  increaseVersionForNext,
  increaseVersionForProd,
} from '../common/version.mjs';

/**
 *
 * @param {import('../common/typedefs.mjs').Package} pkg
 * @returns {Promise<import('./typedefs.mjs').PackageState>}
 */
export async function update(pkg) {
  const channel = detectChannel();

  // Increase package version
  const updatedPkg =
    channel === 'prod'
      ? await increaseVersionForProd(pkg)
      : await increaseVersionForNext(pkg);

  const tag = should('checkGitTags') ? await gitTagFor(updatedPkg) : null;

  const release = should('checkGithubRelease')
    ? await githubReleaseFor(updatedPkg)
    : null;
  const npmVersionInfo = should('checkNpm')
    ? await npmVersionFor(updatedPkg)
    : null;
  const npmVersion = npmVersionInfo ? npmVersionInfo[channel] : null;

  return {
    version: updatedPkg.version,
    githubRelease: release,
    gitTag: tag,
    npmVersion: npmVersion,
  };
}
