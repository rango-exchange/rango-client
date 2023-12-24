import { PUBLISH_COMMIT_SUBJECT } from '../common/constants.mjs';
import { getLastCommitMessage, getLastCommitSubject } from '../common/git.mjs';
import { tagNameToPkgName } from '../common/utils.mjs';

/**
 *
 * @returns {Promise<pkg[]>}
 * @typedef {Object} pkg
 * @property {string} pkg.name
 * @property {string} pkg.version
 */
export async function checkCommitAndGetPkgs() {
  const lastCommitSubject = await getLastCommitSubject();
  const lastCommitMessage = await getLastCommitMessage();

  if (lastCommitSubject !== PUBLISH_COMMIT_SUBJECT) {
    throw new Error('Can not proceed');
  }

  const lines = lastCommitMessage.split('\n');
  const affectedPackagesList = lines.find((line) =>
    line.startsWith('Affected packages:')
  );

  if (!affectedPackagesList) {
    throw new Error("Commit message isn't valid");
  }

  const [, affectedPackages] = affectedPackagesList.split(
    'Affected packages: '
  );
  const pkgs = affectedPackages.split(',').map((pkg) => {
    const [name, version] = pkg.split('@');

    return {
      name: tagNameToPkgName(name),
      version: version,
    };
  });

  return pkgs;
}
