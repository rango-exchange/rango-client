import fs from 'fs/promises';
import path from 'path';
import { BUILD_META_FILE_SUFFIX, NPM_ORG_NAME } from '../common/constants.mjs';
import { partial } from 'filesize';

const size = partial({ standard: 'jedec' });

// output example: @rango-dev/widget-embedded
function getPackageName(fileName) {
  return `${NPM_ORG_NAME}/${fileName.split(BUILD_META_FILE_SUFFIX)[0]}`;
}

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
      diff: formatBundleSizeDiff(
        formatBundleSizeDiff(currentBranchPackagesAndBundlesSize[item], 0)
      ),
    };
  });

  return changes;
}
