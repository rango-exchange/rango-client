import fs from 'fs/promises';
import path from 'path';
import { BUILD_META_FILE_SUFFIX, NPM_ORG_NAME } from '../common/constants.mjs';
import { partial } from 'filesize';

const size = partial({ standard: 'jedec' });

/**
 * Generates the package name based on the file name.
 * @param {string} fileName - The file name.
 * @returns {string} - The generated package name. example: @arlert-dev/widget-embedded
 *
 */
function getPackageName(fileName) {
  return `${NPM_ORG_NAME}/${fileName.split(BUILD_META_FILE_SUFFIX)[0]}`;
}

/**
 * Formats the bundle size difference for display.
 * @param {number} bundleSizeDiff - The difference in bundle size.
 * @param {number} initialBundleSize - The initial bundle size.
 * @returns {string} - The formatted bundle size difference.
 */
function formatBundleSizeDiff(bundleSizeDiff, initialBundleSize) {
  if (bundleSizeDiff === 0 && initialBundleSize > 0) {
    return 'No changes';
  }

  if (bundleSizeDiff > 0 && initialBundleSize === 0) {
    return 'Added';
  }

  if (bundleSizeDiff < 0 && bundleSizeDiff === initialBundleSize) {
    return 'Deleted';
  }

  const sign = bundleSizeDiff > 0 ? '+' : '-';
  const diffPercentage = Math.round(
    (Math.abs(bundleSizeDiff) / initialBundleSize) * 100
  );

  return `${sign}${size(Math.abs(bundleSizeDiff))} (${sign}${diffPercentage}%)`;
}

/**
 * ESBuild meta file interface:
 * https://esbuild.github.io/api/#metafile
 */

/**
 * Parses ESBuild meta JSON files to extract package names and bundle sizes.
 * @param {string[]} files - An array of file paths to ESBuild meta JSON files.
 * @returns {Promise<{[packageName: string]: number}>} - A promise resolving to an object containing package names and their respective bundle sizes.
 */
async function parseBuildJsonFiles(files) {
  const packagesAndBundleSize = {};

  for (const build of files) {
    const data = JSON.parse(await fs.readFile(build, 'utf8'));
    const outputBytes = Object.values(data.outputs)
      .map((outputs) => outputs.bytes)
      .reduce((prev, item) => prev + item, 0);
    packagesAndBundleSize[path.basename(build)] = outputBytes;
  }

  return packagesAndBundleSize;
}

/**
 * Compares the bundle sizes between the target and current branches.
 * @param {string[]} targetBranchBuilds - An array of file paths to ESBuild meta JSON files from the target branch.
 * @param {string[]} currentBranchBuilds - An array of file paths to ESBuild meta JSON files from the current branch.
 * @returns {Promise<{[packageName: string]: { 'current branch': string, 'target branch': string, diff: string }}>} - A promise resolving to an object containing package names and their respective bundle size differences.
 */
export async function compareBuildJsonFiles(
  targetBranchBuilds,
  currentBranchBuilds
) {
  const targetBranchPackagesAndBundleSize = await parseBuildJsonFiles(
    targetBranchBuilds
  );
  const currentBranchPackagesAndBundlesSize = await parseBuildJsonFiles(
    currentBranchBuilds
  );

  const addedPackages = Object.keys(currentBranchPackagesAndBundlesSize).filter(
    (item) => !Object.keys(targetBranchPackagesAndBundleSize).includes(item)
  );

  const changes = {};

  for (const key in targetBranchPackagesAndBundleSize) {
    const bundleSizeDiff =
      (currentBranchPackagesAndBundlesSize[key] || 0) -
      targetBranchPackagesAndBundleSize[key];

    changes[getPackageName(key)] = {
      'current branch': size(currentBranchPackagesAndBundlesSize[key] || 0),
      'target branch': size(targetBranchPackagesAndBundleSize[key]),
      diff: formatBundleSizeDiff(
        bundleSizeDiff,
        targetBranchPackagesAndBundleSize[key]
      ),
    };
  }

  addedPackages.forEach((item) => {
    changes[getPackageName(item)] = {
      'current branch': size(currentBranchPackagesAndBundlesSize[item]),
      'target branch': size(0),
      diff: formatBundleSizeDiff(currentBranchPackagesAndBundlesSize[item], 0),
    };
  });

  return changes;
}
