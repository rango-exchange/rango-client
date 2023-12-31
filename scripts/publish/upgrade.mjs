import { execa } from 'execa';
import { CustomScriptError } from '../common/errors.mjs';

/**
 *
 * Update all the packages that use a specific package to a specific package
 *
 * @param {import("../common/typedefs.mjs").Package} pkgs
 */
export async function upgradeDependents(pkg) {
  await execa('yarn', [
    'upgrade-all',
    '--project',
    pkg.name,
    '--version',
    pkg.version,
    '--no-install',
  ]).catch((e) => {
    throw new CustomScriptError(e.stderr);
  });
}
