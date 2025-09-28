import { execa } from 'execa';
import process from 'process';
import fs from 'fs/promises';
import path from 'path';
import { packageJsonPath, rootPath } from '../common/path.mjs';
import { WIDGET_EMBEDDED_PACKAGE_NAME } from '../deploy/config.mjs';
import { EXAMPLES_PATH, EXClUDED_EXAMPLES_FOR_BUILD } from './config.mjs';
import { packageJson } from '../common/utils.mjs';
import { getExamplePath, getCurrentWidgetEmbeddedVersion } from './utils.mjs';
import chalk from 'chalk';
import { logAsSection } from '../publish/utils.mjs';

/**
 * Get all example directory names that should be built
 * @returns {Promise<string[]>} Array of example names
 */
async function getExamplesNames() {
  const dirents = await fs.readdir(EXAMPLES_PATH, { withFileTypes: true });
  return dirents
    .filter(
      (dirent) =>
        dirent.isDirectory() &&
        !EXClUDED_EXAMPLES_FOR_BUILD.includes(dirent.name)
    )
    .map((dirent) => dirent.name);
}

/**
 * Add current embedded widget version to an example's package.json
 * @param {string} exampleName - Name of the example
 * @param {string} currentEmbeddedVersion - Version to add
 */
async function addCurrentEmbeddedToExample(
  exampleName,
  currentEmbeddedVersion
) {
  console.log(chalk.blue(`Adding widget embedded to: ${exampleName}`));

  const examplePath = await getExamplePath(exampleName);
  const examplePackageJson = packageJson(examplePath);

  examplePackageJson.dependencies[WIDGET_EMBEDDED_PACKAGE_NAME] =
    currentEmbeddedVersion;

  await fs.writeFile(
    packageJsonPath(examplePath),
    JSON.stringify(examplePackageJson, null, 2)
  );
}

/**
 * Add examples directory to root package.json workspaces
 */
async function addExamplesToRootPackageJson() {
  const rootPackageJson = await packageJson();

  if (!rootPackageJson.workspaces.packages.includes('examples/*')) {
    rootPackageJson.workspaces.packages.push('examples/*');
  }

  await fs.writeFile(
    packageJsonPath(),
    JSON.stringify(rootPackageJson, null, 2)
  );
}

/**
 * Add skipLibCheck to TypeScript configuration files
 *
 * We need to skip lib check because rewired examples require react-scripts installation
 * which can corrupt our singers build. By skipping lib check, we avoid checking the build
 * and allow the process to pass successfully.
 */
async function addSkipLibCheckToTsConfigs() {
  console.log('Adding skip lib check to TypeScript configs');

  const configFiles = [
    path.join(rootPath(), 'tsconfig.bundler.json'),
    path.join(rootPath(), 'tsconfig.libnext.json'),
  ];

  for (const configPath of configFiles) {
    try {
      const configContent = await fs.readFile(configPath, 'utf8');
      const configJson = JSON.parse(configContent);

      if (!configJson.compilerOptions) {
        configJson.compilerOptions = {};
      }

      configJson.compilerOptions.skipLibCheck = true;

      await fs.writeFile(configPath, JSON.stringify(configJson, null, 2));
      console.log(`Updated ${path.basename(configPath)}`);
    } catch (error) {
      console.warn(`Warning: Could not update ${configPath}:`, error.message);
    }
  }
}

/**
 * Install all packages using yarn
 */
async function installAllPackages() {
  console.log('Installing packages...');
  await execa('yarn');
}

/**
 * Build all packages
 */
async function buildAllPackages() {
  console.log('Building all packages...');
  await execa('yarn', ['build:all']);
}

/**
 * Main execution function
 */
async function run() {
  try {
    console.log(chalk.blue('Starting build process...'));
    logAsSection('::group:: Adding examples to workspace...');
    // Add examples to workspace
    await addExamplesToRootPackageJson();
    console.log('::endgroup::');

    logAsSection('::group:: Updating examples widget embedded version...');
    // Get current embedded version
    const embeddedVersion = await getCurrentWidgetEmbeddedVersion();
    console.log(`Using embedded version: ${embeddedVersion}`);

    // Update all examples with current embedded version
    const exampleNames = await getExamplesNames();
    console.log(`Found ${exampleNames.length} examples to process`);

    for (const exampleName of exampleNames) {
      await addCurrentEmbeddedToExample(exampleName, embeddedVersion);
    }
    console.log('::endgroup::');

    // Configure TypeScript to skip lib check
    await addSkipLibCheckToTsConfigs();

    logAsSection('::group:: Installing dependencies...');
    await installAllPackages();
    console.log('::endgroup::');
    logAsSection('::group:: Build all packages...');
    await buildAllPackages();
    console.log('::endgroup::');

    console.log(chalk.green('Build process completed successfully!'));
  } catch (error) {
    console.error('Build process failed:', error);
    throw error;
  }
}

// Execute the build process
run().catch((error) => {
  console.error('Fatal error during build:', error);
  process.exit(1);
});
