import { execa } from 'execa';
import { IncreaseVersionFailedError } from './errors.mjs';
import { Bumper } from 'conventional-recommended-bump';
import { TAG_PACKAGE_PREFIX } from './changelog.mjs';

/**
 *
 * @param {import('./typedefs.mjs').Package} pkg
 * @returns {Promise<import('./typedefs.mjs').Package>} Returns package with updated version
 */
export async function increaseVersionForNext(pkg) {
  /** @type {import('./typedefs.mjs').IncreaseVersionResult} */
  const versions = await execa('yarn', [
    'workspace',
    pkg.name,
    'version',
    '--preid=next',
    '--prerelease',
    '--no-git-tag-version',
    '--json',
  ])
    .then((result) => result.stdout)
    .then((output) => {
      const versions = parseYarnVersionResult(output);

      if (!versions.current && !versions.next) {
        throw new IncreaseVersionFailedError(
          `Couldn't extract versions from logs \n ${logs.join('\n')}`
        );
      }
      return versions;
    })
    .catch((err) => {
      if (err instanceof IncreaseVersionFailedError) throw err;

      throw new IncreaseVersionFailedError(err.stderr);
    });

  return {
    ...pkg,
    version: versions.next,
  };
}

/**
 *
 * @param {import('./typedefs.mjs').Package} pkg
 * @returns {Promise<import('./typedefs.mjs').Package>} Returns package with updated version
 */
export async function increaseVersionForProd(pkg) {
  const recommendation = await recommendBump(pkg);
  const releaseType = recommendation.releaseType;

  /** @type {import('./typedefs.mjs').IncreaseVersionResult} */
  const versions = await execa('yarn', [
    'workspace',
    pkg.name,
    'version',
    `--${releaseType}`,
    '--no-git-tag-version',
    '--json',
  ])
    .then((result) => result.stdout)
    .then((output) => {
      const versions = parseYarnVersionResult(output);

      if (!versions.current && !versions.next) {
        throw new IncreaseVersionFailedError(
          `Couldn't extract versions from logs \n ${logs.join('\n')}`
        );
      }
      return versions;
    })
    .catch((err) => {
      if (err instanceof IncreaseVersionFailedError) throw err;

      throw new IncreaseVersionFailedError(err.stderr);
    });

  return {
    ...pkg,
    version: versions.next,
  };
}

/**
 *
 * Recommend next version based on Angular conventional commits
 *
 * @param {import('./typedefs.mjs').Package} pkg package
 * @return {Promise<{level: number,reason: string, releaseType: 'patch' | 'minor' | 'major',}>}
 */
export async function recommendBump(pkg) {
  const bumper = new Bumper().loadPreset('angular');
  bumper.tag({
    prefix: TAG_PACKAGE_PREFIX(pkg),
  });
  const recommendation = await bumper.bump();

  return recommendation;
}

function parseYarnVersionResult(output) {
  const logs = output.split('\n').map((jsonString) => JSON.parse(jsonString));

  const versions = logs.reduce(
    (prev, log) => {
      if (log.data.startsWith('Current version:')) {
        return {
          ...prev,
          current: log.data.replace('Current version: ', ''),
        };
      }
      if (log.data.startsWith('New version:')) {
        return {
          ...prev,
          next: log.data.replace('New version: ', ''),
        };
      }
    },
    { current: null, next: null }
  );

  return versions;
}
