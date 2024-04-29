import { execa } from 'execa';
import { cp, readFile, writeFile } from 'node:fs/promises';
import { detectChannel } from '../common/github.mjs';
import {
  ENABLE_PREVIEW_DEPLOY,
  EXCLUDED_PACKAGES,
  VERCEL_ORG_ID,
  VERCEL_PACKAGES,
  VERCEL_TOKEN,
} from './config.mjs';
import * as actionCore from '@actions/core';
import { VercelError } from '../common/errors.mjs';
import {
  convertPackageLocationToFullPath,
  packageJson,
  packageNameWithoutScope,
  workspacePackages,
} from '../common/utils.mjs';
import { getTransformedRoutes } from '@vercel/routing-utils';
import { dirname, join } from 'node:path';
import { mkdir } from 'node:fs/promises';

import { fileURLToPath } from 'node:url';

export function getVercelProjectId(packageName) {
  return VERCEL_PACKAGES[packageName];
}

export async function deployProjectsToVercel(pkgs) {
  await Promise.all(pkgs.map((pkg) => deploySingleProjectToVercel(pkg)));
}
export async function deploySingleProjectToVercel(pkg) {
  const deployTo = detectChannel() === 'prod' ? 'production' : 'preview';

  const env = {
    VERCEL_ORG_ID: VERCEL_ORG_ID,
    VERCEL_PROJECT_ID: getVercelProjectId(pkg.name),
  };

  if (!env.VERCEL_PROJECT_ID) {
    console.log(`::warning::Couldn't find PROJECT_ID env for ${pkg.name}`);
  }

  console.log(`start deploying ${pkg.name}...`);

  await execa(
    'vercel',
    [
      'pull',
      '--cwd',
      pkg.location,
      '--environment',
      deployTo,
      '--token',
      VERCEL_TOKEN,
      '--yes',
    ],
    { env }
  );

  const currentDir = dirname(fileURLToPath(import.meta.url));
  const configPath = join(currentDir, 'vercel.json');
  await makeOutputFolderForBuildOutputApi(pkg.location, configPath);

  await execa(
    'vercel',
    ['build', '--cwd', pkg.location, '--token', VERCEL_TOKEN],
    { env }
  );

  const vercelResult = await execa(
    'vercel',
    [pkg.location, '--prebuilt', '--token', VERCEL_TOKEN],
    { env }
  )
    .then((result) => result.stdout)
    .catch((err) => {
      throw new VercelError(
        `An error occurred on deploy ${pkg.name} package \n ${err.message} \n ${err.stderr}`
      );
    });

  // Run tail -1 on the stdout to get the last line, because `vercel` command returns the URL in the last line.
  const urlPreview = await execa('tail', ['-1'], { input: vercelResult })
    .then((result) => result.stdout)
    .catch((err) => {
      throw new VercelError(
        `An error occurred on get url preview for ${pkg.name} package \n ${err.message} \n ${err.stderr}`
      );
    });

  // set package name and url preview to github output for use in workflow
  const tagName = packageNameWithoutScope(pkg.name);
  actionCore.setOutput(`${tagName}-url`, urlPreview);

  console.log(`${tagName}-url:`, urlPreview);
  console.log(`${pkg.name} deployed.`);
}

export function groupPackagesForDeploy(packages) {
  const output = {
    npm: [],
    vercel: [],
  };

  packages.forEach((pkg) => {
    if (!!getVercelProjectId(pkg.name)) {
      output.vercel.push(pkg);
    } else if (!pkg.private) {
      // If getVercelProjectId returns undefined, it's possible to be added as npm package
      // So here we are making sure it's not a private package and can be published using npm
      output.npm.push(pkg);
    }
  });

  return output;
}

export async function getClientsListToBeDeployed() {
  /*
    Deploys packages based on the state of the `ENABLE_PREVIEW_DEPLOY` environment variable.
    if ENABLE_PREVIEW_DEPLOY is true, only packages that has project id in workflow environments will be deployed.
    else private packages will be deployed.
 */

  // Detect last release and what packages has changed since then.
  const packages = await workspacePackages();
  const listPackagesToBeDeployed = packages.filter((pkg) => {
    if (EXCLUDED_PACKAGES.includes(pkg.name)) return false;

    if (ENABLE_PREVIEW_DEPLOY) {
      const hasProjectId =
        getVercelProjectId(pkg.name) &&
        getVercelProjectId(pkg.name) !== 'NOT SET';
      return pkg.private && hasProjectId;
    } else {
      return pkg.private;
    }
  });

  if (ENABLE_PREVIEW_DEPLOY) {
    console.log('preview deployment is enabled.');
    console.log(
      'these packages will be deployed:',
      listPackagesToBeDeployed.map((pkg) => pkg.name).join(', ')
    );
    console.log(
      'note: if you need add more packages to be deployed, first you need to add vercel project id to workflow environments then follow documentation there.'
    );
  } else {
    console.log('preview deployment is disabled.');
    console.log(
      'these packages will be deployed:',
      listPackagesToBeDeployed.map((pkg) => pkg.name).join(', ')
    );
  }

  return listPackagesToBeDeployed;
}

/**
 *
 * Reading a vercel.json file and convert into `Build Output API` compatible format.
 * And also adding some more configs in addition to what exists in `vercel.json`.
 *
 * References:
 * https://vercel.com/docs/build-output-api/v3/features
 * https://vercel.com/docs/projects/project-configuration
 *
 * @param {Path} configPath
 */
export async function getVercelJsonAndMakeBuildOutputApi(configPath) {
  const vercelJson = await readFile(configPath);
  const parsedVercelJson = JSON.parse(vercelJson);

  const supportedConfigs = ['rewrites'];
  const unsupportedKeys = Object.keys(parsedVercelJson).filter(
    (key) => !supportedConfigs.includes(key)
  );
  if (unsupportedKeys.length > 0) {
    throw new Error(
      "You've used unsupported config in vercel.json. Please make sure you've implemented it first. Supported configs:" +
        supportedConfigs.join(',')
    );
  }
  const configJsonRewrites = parsedVercelJson.rewrites;
  const routes = getTransformedRoutes({
    rewrites: configJsonRewrites,
  });

  // This copied from `vercel build` output.
  routes.routes.unshift({
    src: '^/[^./]+\\.[0-9a-f]{8}\\.(css|js|png|jpg|webp|avif|svg)$',
    headers: {
      'cache-control': 's-maxage=31536000, immutable',
    },
    continue: true,
  });

  const config = {
    version: 3,
    routes,
  };

  return config;
}

/**
 *
 * Vercel's Build Output API needs to create `.vercel/output` and put static files and a config in there.
 * This function should be run after a client has been built
 * then by running this function it copies dist folder and create a config.json that vercel needs for deployments.
 *
 * @param {Path} pkgLocation
 * @param {Path} configPath
 */
export async function makeOutputFolderForBuildOutputApi(
  pkgLocation,
  configPath
) {
  const pkg = packageJson(pkgLocation);

  if (!pkg.main) {
    throw new Error(
      "We relying on `main` field inside your package.json. Make sure you've set it."
    );
  }

  // Paths
  const pkgPath = convertPackageLocationToFullPath(pkgLocation);
  const mainDir = dirname(join(pkgPath, pkg.main));
  const targetDir = join(pkgPath, '.vercel/output');
  const targetStaticDir = join(targetDir, 'static');

  console.log(
    `copying build artifacts to .vercel/output for ${pkgLocation}...`
  );
  await mkdir(targetStaticDir, { recursive: true });
  await cp(mainDir, targetStaticDir, { recursive: true });

  console.log(`creating config.json for ${pkgLocation}...`);
  const buildOutput = await getVercelJsonAndMakeBuildOutputApi(configPath);
  const targetConfigPath = join(targetDir, 'config.json');
  await writeFile(targetConfigPath, JSON.stringify(buildOutput));
}
