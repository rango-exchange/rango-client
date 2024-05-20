import fs from 'fs/promises';
import path from 'path';

function formatBundleSize(bundleSize) {
  if (bundleSize === 0) {
    return '-';
  }

  return `${Math.round(bundleSize / 1000)} kb`;
}

function formatBundleSizeDiff(bundleSizeDiff, initialBundleSize) {
  if (bundleSizeDiff === 0) {
    return '-';
  }

  const sign = bundleSizeDiff > 0 ? '+' : '-';
  const diffPercentage = Math.round(
    (Math.abs(bundleSizeDiff) / initialBundleSize) * 100
  );

  return `${sign}${formatBundleSize(
    Math.abs(bundleSizeDiff)
  )} (${sign}${diffPercentage}%)`;
}

async function findBuildJsonFiles(directory) {
  const files = [];

  async function traverseDirectory(currentDir) {
    const dirContents = await fs.readdir(currentDir);
    for (const item of dirContents) {
      const itemPath = path.join(currentDir, item);
      const stats = await fs.stat(itemPath);
      const isDirectory = stats.isDirectory();

      if (isDirectory) {
        await traverseDirectory(itemPath);
      } else if (item.endsWith('.build.json')) {
        files.push(itemPath);
      }
    }
  }

  await traverseDirectory(directory);
  return files;
}

async function parseBuildJsonFiles(files) {
  const packagesAndBundleSize = {};

  /**
   * ESBuild meta file interface:
   * https://esbuild.github.io/api/#metafile
   */
  for (const build of files) {
    const data = JSON.parse(await fs.readFile(build, 'utf8'));
    const outputBytes = Object.values(data.outputs)
      .map((outputs) => outputs.bytes)
      .reduce((prev, item) => prev + item, 0);
    packagesAndBundleSize[path.basename(build)] = outputBytes;
  }

  return packagesAndBundleSize;
}

async function compareBuildJsonFiles(targetBranchBuilds, currentBranchBuilds) {
  const targetBranchPackagesAndBundleSize = await parseBuildJsonFiles(
    targetBranchBuilds
  );
  const currentBranchPackagesAndBundlesSize = await parseBuildJsonFiles(
    currentBranchBuilds
  );

  const deletedPackage = Object.keys(targetBranchPackagesAndBundleSize).filter(
    (item) => !Object.keys(currentBranchPackagesAndBundlesSize).includes(item)
  );

  const addedPackages = Object.keys(currentBranchPackagesAndBundlesSize).filter(
    (item) => !Object.keys(targetBranchPackagesAndBundleSize).includes(item)
  );

  const changes = {};

  for (const key in targetBranchPackagesAndBundleSize) {
    const bundleSizeDiff =
      currentBranchPackagesAndBundlesSize[key] -
      targetBranchPackagesAndBundleSize[key];

    changes[getPackageName(key)] = {
      'current branch': formatBundleSize(
        currentBranchPackagesAndBundlesSize[key]
      ),
      'target branch': formatBundleSize(targetBranchPackagesAndBundleSize[key]),
      diff: formatBundleSizeDiff(
        bundleSizeDiff,
        targetBranchPackagesAndBundleSize[key]
      ),
    };
  }

  addedPackages.forEach((item) => {
    changes[getPackageName(item)] = {
      'current branch': formatBundleSize(
        currentBranchPackagesAndBundlesSize[item]
      ),
      'target branch': formatBundleSize(0),
      diff: formatBundleSizeDiff(currentBranchPackagesAndBundlesSize[item], 0),
    };
  });

  deletedPackage.forEach((item) => {
    changes[getPackageName(item)] = {
      'current branch': formatBundleSize(0),
      'target branch': formatBundleSize(
        targetBranchPackagesAndBundleSize[item]
      ),
      diff: formatBundleSizeDiff(
        -targetBranchPackagesAndBundleSize[item],
        targetBranchPackagesAndBundleSize[item]
      ),
    };
  });

  return changes;
}

function getPackageName(fileName) {
  const SCOPE = '@rango-dev';
  return `${SCOPE}/${fileName.split('.build.json')[0]}`;
}

async function run() {
  const [, currentBranchDirectory, targetBranchDirectory] = process.argv;

  const targetBranchPath = path.join(process.cwd(), targetBranchDirectory);
  const currentBranchPath = path.join(process.cwd(), currentBranchDirectory);

  let directoryIsMissing;
  try {
    const pathsStats = await Promise.all([
      fs.stat(targetBranchPath),
      fs.stat(currentBranchPath),
    ]);
    directoryIsMissing = pathsStats.some((stat) => !stat.isDirectory());
  } catch (error) {
    directoryIsMissing = true;
  }

  if (directoryIsMissing) {
    console.log(
      'Directories for the target or current branch do not exist, the bundle size comparison will be skipped.'
    );
    return;
  }

  const targetBranchBuilds = await findBuildJsonFiles(targetBranchPath);
  const currentBranchBuilds = await findBuildJsonFiles(currentBranchPath);

  const comparison = await compareBuildJsonFiles(
    targetBranchBuilds,
    currentBranchBuilds
  );
  console.table(comparison);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
