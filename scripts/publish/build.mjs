import { execa } from 'execa';
import { NxError } from '../common/errors.mjs';

/**
 * Get a list of packages to run `build` on them.
 *
 * @param {import("../common/typedefs.mjs").Package[]} pkgs
 *
 */
export async function build(pkgs) {
  performance.mark(`start-publish-build`);

  const projects = pkgs.map((pkg) => pkg.name).join(',');
  const result = await execa('yarn', [
    'nx',
    'run-many',
    '--projects',
    projects,
    '--target',
    'build',
  ])
    .then(({ stdout }) => stdout)
    .catch((err) => {
      throw new NxError(err.stderr + err.stdout);
    });

  performance.mark(`end-publish-build`);
  const duration_build = performance.measure(
    `publish-build`,
    `start-publish-build`,
    `end-publish-build`
  ).duration;
  console.log(`Built. ${duration_build}ms`);

  return result;
}
