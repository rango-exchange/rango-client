import { execa } from 'execa';
import { readFile, writeFile } from 'node:fs/promises';
import { CustomScriptError } from '../common/errors.mjs';
import { packageJsonPath } from '../common/path.mjs';
import { workspacePackages } from '../common/utils.mjs';

/**
 * Upgrades all dependents of a given package to use its new version.
 * Internally calls the `yarn upgrade-all` workspace script.
 *
 * @param {import("../common/typedefs.mjs").Package} pkg
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

/**
 * Upgrades dependents for every package in the list, in sequence.
 * Must be called after versions have been bumped but **before** the Nx build,
 * so that Nx resolves the correct (new) peer/dep versions from package.json files.
 *
 * @param {import("../common/typedefs.mjs").Package[]} pkgs
 */
export async function upgradeAllDependents(pkgs) {
  for (const pkg of pkgs) {
    await upgradeDependents(pkg);
  }
}

/**
 * Records the version each published package was at *before* the upgrade step,
 * keyed by package name. This is the version that dependents' package.json files
 * referenced before `upgradeAllDependents` was called — i.e. the value we revert
 * to for failed publishers.
 *
 * @param {import("../common/typedefs.mjs").Package[]} pkgs
 * Packages as they exist before version bumping (original versions).
 * @returns {Map<string, string>} pkg.name → original version string
 */
export function snapshotOriginalVersions(pkgs) {
  return new Map(pkgs.map((pkg) => [pkg.name, pkg.version]));
}

/**
 * Reverts dependency version entries inside every workspace package.json that
 * referenced a package that failed to publish.
 *
 * A dependent may depend on several packages from the same publish run.
 * Some of those may have published successfully and some may not. This function
 * only touches the entries for the failed packages — it leaves entries for
 * successfully published packages at their new (bumped) version.
 *
 * @param {import("../common/typedefs.mjs").Package[]} failedPkgs
 *   Packages that did NOT publish successfully.
 * @param {Map<string, string>} originalVersions
 *   The version map produced by `snapshotOriginalVersions` — what each package's
 *   version was before the upgrade step ran.
 */
export async function revertDependentsForFailedPackages(
  failedPkgs,
  originalVersions
) {
  if (failedPkgs.length === 0) return;

  // Collect package.json paths for every package registered in the workspace.
  // `workspacePackages()` is the same source used elsewhere in this pipeline
  // (e.g. version-log.mjs) so we stay within the known monorepo boundary
  // instead of crawling the filesystem with a glob.
  const allWorkspacePkgs = await workspacePackages();
  const packageJsonFiles = allWorkspacePkgs.map((pkg) =>
    packageJsonPath(pkg.location)
  );

  for (const filePath of packageJsonFiles) {
    const raw = await readFile(filePath, 'utf-8');
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      // Skip malformed files — shouldn't happen in a healthy repo.
      continue;
    }

    let dirty = false;

    // All dependency field types that can hold version references.
    const depFields = [
      'dependencies',
      'devDependencies',
      'peerDependencies',
      'optionalDependencies',
    ];

    for (const failedPkg of failedPkgs) {
      const originalVersion = originalVersions.get(failedPkg.name);
      if (!originalVersion) continue;

      for (const field of depFields) {
        if (parsed[field]?.[failedPkg.name] !== undefined) {
          const currentValue = parsed[field][failedPkg.name];
          // Preserve range prefixes (^, ~, >=, etc.) that were already there.
          // We replace only the version number portion, keeping the prefix intact.
          const prefix = currentValue.match(/^[^0-9]*/)?.[0] ?? '';
          const reverted = `${prefix}${originalVersion}`;

          if (currentValue !== reverted) {
            parsed[field][failedPkg.name] = reverted;
            dirty = true;
            console.warn(
              `  ↩ ${filePath}: reverted ${failedPkg.name} from "${currentValue}" → "${reverted}"`
            );
          }
        }
      }
    }

    if (dirty) {
      // Write back with the same indentation style as the original file.
      const indent = raw.match(/^{\n(\s+)/)?.[1] ?? '  ';
      await writeFile(filePath, JSON.stringify(parsed, null, indent) + '\n', 'utf-8');
    }
  }
}