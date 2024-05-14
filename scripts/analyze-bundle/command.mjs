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

async function findBuildJsonFiles(directory, excludedPaths = []) {
  const files = [];
  const excludedPathsWithNodeModules = excludedPaths.concat(['node_modules']);

  async function traverseDirectory(currentDir) {
    const dirContents = await fs.readdir(currentDir);
    for (const item of dirContents) {
      const itemPath = path.join(currentDir, item);
      const stats = await fs.stat(itemPath);
      const isDirectory = stats.isDirectory();

      if (isDirectory) {
        if (excludedPathsWithNodeModules.includes(item)) continue;
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
  return `@rango-dev/${fileName.split('.build.json')[0]}`;
}

async function run() {
  const currentDirectory = process.cwd();
  const targetBranchBuilds = await findBuildJsonFiles(currentDirectory, [
    'current-branch',
  ]);
  const currentBranchBuilds = await findBuildJsonFiles(
    path.join(currentDirectory, 'current-branch')
  );

  const comparison = await compareBuildJsonFiles(
    targetBranchBuilds,
    currentBranchBuilds
  );
  console.table(comparison);
}

run().catch((error) =>
  console.error(
    "Error: There's a problem when making the report for the package bundles.",
    error
  )
);
