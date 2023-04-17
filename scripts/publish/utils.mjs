import chalk from 'chalk';
import { execa } from 'execa';
import { readFileSync } from 'fs';
import { join } from 'path';
import conventionanRecommendBump from 'conventional-recommended-bump';
import { printDirname } from '../common/utils.mjs';
import { VERCEL_ORG_ID, VERCEL_PACKAGES, VERCEL_TOKEN } from './config.mjs';
const root = join(printDirname(), '..', '..');

/**
 *
 * Recommend next version based on Angular conventional commits
 *
 * @param {string} pkg pacakge name
 * @return {Promise<{level: number,reason: string, releaseType: 'patch' | 'minor' | 'major',}>}
 */
export async function recommendBump(pkg) {
  return new Promise((resolve, reject) => {
    conventionanRecommendBump(
      {
        preset: `angular`,
        lernaPackage: pkg,
      },
      (error, recommendation) => {
        if (error) {
          reject(error);
        } else {
          resolve(recommendation);
        }
      },
    );
  });
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

  console.log(`start deplyoing ${pkg.name}...`);

  await execa(
    'yarn',
    [
      'vercel',
      'pull',
      '--cwd',
      pkg.location,
      '--environment',
      deployTo,
      '--token',
      VERCEL_TOKEN,
      '--yes',
    ],
    { env },
  );
  await execa('yarn', ['vercel', 'build', '--cwd', pkg.location, '--token', VERCEL_TOKEN], { env });
  await execa('yarn', ['vercel', pkg.location, '--prebuilt', '--token', VERCEL_TOKEN], { env });

  console.log(`${pkg.name} deployed.`);
}

export async function publishPackages(updatedPkgs, dist = 'next') {
  const result = await Promise.all(
    updatedPkgs.map(({ location }) =>
      execa('yarn', ['publish', location, '--tag', dist]).then(({ stdout }) => stdout),
    ),
  );

  console.log('Published...');
  console.log(result);
}

export async function buildPackages(updatedPkgs) {
  const projects = updatedPkgs.map((pkg) => pkg.name).join(',');
  const ps = execa('yarn', ['nx', 'run-many', '--projects', projects, '--target', 'build']);
  ps.stdout.pipe(process.stdout);
  return ps;
}

export async function pushToRemote(branch, remote = 'origin') {
  const { stdout } = await execa('git', [
    'push',
    '--follow-tags',
    '--no-verify',
    '--atomic',
    remote,
    branch,
  ]);

  console.log(stdout);
}
export async function tagPackages(updatedPackages, { skipGitTagging }) {
  const tags = updatedPackages.map((pkg) => `${packageNameWithoutScope(pkg.name)}@${pkg.version}`);
  const files = updatedPackages.map((pkg) => join(root, pkg.location, 'package.json'));

  const subject = `chore(release): publish\n\n`;
  const list = tags.map((tag) => `- ${tag}`).join('\n');
  const message = subject + list;

  // making a publish commit
  await execa('git', ['add', '--', ...files]);
  await execa('git', ['commit', '-m', message, '-m', `Affected packages: ${tags.join(',')}`]);

  // creating annotated tags based on packages
  if (!skipGitTagging) {
    await Promise.all(tags.map((tag) => execa('git', ['tag', '-a', tag, '-m', tag])));
  }

  return tags;
}

export async function increaseVersionForNext(changedPkgs) {
  await Promise.all(
    changedPkgs.map(({ name }) =>
      execa('yarn', [
        'workspace',
        name,
        'version',
        '--preid=next',
        '--prerelease',
        '--no-git-tag-version',
      ]).then(({ stdout }) => stdout),
    ),
  );

  // Getting latest packages info to show the updated version.
  // We only return changed packges, not whole repo.
  const packages = (await workspacePackages()).filter((pkg) => {
    return !!changedPkgs.find((changedPkg) => pkg.name === changedPkg.name);
  });

  return packages;
}

export async function increaseVersionForMain(changedPkgs) {
  const nextVersions = {};

  try {
    await Promise.all(
      changedPkgs.map(({ name }) =>
        recommendBump(name).then((recommendation) => {
          console.log({ name, recommendation });
          nextVersions[name] = recommendation.releaseType;
        }),
      ),
    );
  } catch (e) {
    throw new Error(`Calculating next version failed. details: ${e}`);
  }

  await Promise.all(
    changedPkgs.map(({ name }) => {
      const nextVersion = nextVersions[name];
      return execa('yarn', [
        'workspace',
        name,
        'version',
        `--${nextVersion}`,
        '--no-git-tag-version',
      ]).then(({ stdout }) => stdout);
    }),
  );

  // Getting latest packages info to show the updated version.
  // We only return changed packges, not whole repo.
  const packages = (await workspacePackages()).filter((pkg) => {
    return !!changedPkgs.find((changedPkg) => pkg.name === changedPkg.name);
  });

  return packages;
}

export async function changed(since) {
  const pkgs = await workspacePackages();
  const all = await Promise.all(
    pkgs.map(({ name, location, version }) =>
      execa('git', ['log', `${since}..HEAD`, '--oneline', '--', location]).then(
        ({ stdout: result }) => {
          return {
            name,
            location,
            version,
            changed: !!result,
          };
        },
      ),
    ),
  );
  return all.filter((pkg) => pkg.changed);
}
export async function workspacePackages() {
  const { stdout } = await execa('yarn', ['workspaces', 'info']);
  const result = JSON.parse(stdout);
  const packagesName = Object.keys(result);
  const output = packagesName.map((name) => {
    const pkgJson = pacakgeJson(result[name].location);
    return {
      name,
      location: result[name].location,
      version: pkgJson.version,
      private: pkgJson.private || false,
    };
  });
  return output;
}

export function pacakgeJson(location) {
  const fullPath = join(root, location, 'package.json');
  const file = readFileSync(fullPath);
  return JSON.parse(file);
}

export function detectChannel() {
  console.log('base', getEnvWithFallback('REF'));
  if (getEnvWithFallback('REF') === 'refs/heads/main') {
    return 'prod';
  }
  return 'next';
}

// TODO: Check for when there is no tag.
export async function getLastReleasedHashId(useTag = false) {
  if (useTag) {
    const { stdout: hash } = await execa('git', ['rev-list', '--max-count', 1, '--tags']);
    return hash;
  } else {
    const { stdout: hash } = await execa('git', [
      'log',
      '--grep',
      '^chore(release): publish',
      '-n',
      1,
      '--pretty=format:%H',
    ]);
    return hash;
  }
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

export function getVercelProjectId(packageName) {
  return VERCEL_PACKAGES[packageName];
}

export function logAsSection(title, sub = '') {
  let message = chalk.bgBlue.white.bold(title);
  if (!!sub) {
    message += ' ';
    message += sub;
  }
  console.log(message);
}

/*
  Convert:
  @hello-wrold/a-b -> a-b
*/
function packageNameWithoutScope(name) {
  return name.replace(/@.+\//, '');
}

// we are adding a fallback, to make sure predefiend VERCEL_PACKAGES always will be true.
export function getEnvWithFallback(name) {
  return process.env[name] || 'NOT SET';
}
