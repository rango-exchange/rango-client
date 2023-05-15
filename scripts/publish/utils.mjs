import chalk from 'chalk';
import { execa } from 'execa';
import { readFileSync } from 'fs';
import { join } from 'path';
import conventionanRecommendBump from 'conventional-recommended-bump';
import { printDirname } from '../common/utils.mjs';
import { VERCEL_ORG_ID, VERCEL_PACKAGES, VERCEL_TOKEN } from './config.mjs';
import { importJson } from '../common/graph/helpers.mjs';
import { overrideNPMVersionOnLocal } from '../common/npm.mjs';
const root = join(printDirname(), '..', '..');

export async function generateChangelog(pkg, { saveToFile } = { saveToFile: true }) {
  const changelogPath = `${pkg.location}/CHANGELOG.md`;
  const command = [
    'conventional-changelog',
    '-p',
    'angular',
    '-t',
    `${packageNameWithoutScope(pkg.name)}@`,
    '-k',
    pkg.location,
    '--commit-path',
    pkg.location,
  ];

  if (saveToFile) {
    command.push('-i', changelogPath, '-s');
  }

  const { stdout: bin } = await execa('yarn', ['bin', 'conventional-changelog']);
  const { stdout } = await execa(bin, command);

  console.log('[debug]', command);
  console.log('[debug] saveToFile', saveToFile);
  console.log('[debug]', bin);
  console.log('[debug]', stdout);
  return stdout;
}

export async function makeGithubRelease(updatedPkg) {
  const notes = await generateChangelog(updatedPkg, {
    saveToFile: false,
  });
  const tag = generateTagName(updatedPkg);
  await execa('gh', ['release', 'create', tag, '--target', 'main', '--notes', notes]);
}

export async function addChangelogsToStage(updatedPackages) {
  const files = updatedPackages.map((pkg) => join(root, pkg.location, 'CHANGELOG.md'));
  await execa('git', ['add', '--', ...files]);
}

export async function addUpdatedPackageJsonToStage(packages) {
  const files = packages.map((pkg) => join(root, pkg.location, 'package.json'));
  files.push(join(root, 'yarn.lock'));
  await execa('git', ['add', '--', ...files]);
}

export async function packageNamesToPackagesWithInfo(names) {
  const allPackages = await workspacePackages();
  return names.map((pkgName) => allPackages.find((pkg) => pkg.name === pkgName));
}

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
  console.log(`Running build for ${projects}. It takes some time..`);
  const { failed, stderr } = await execa('yarn', [
    'nx',
    'run-many',
    '--projects',
    projects,
    '--target',
    'build',
  ]);
  if (failed) console.error(stderr);
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
  const tags = updatedPackages.map(generateTagName);
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
  const dist = 'next';
  await Promise.all(
    changedPkgs.map(({ name }) => {
      const checkVersionAndIncrease = async () => {
        const versions = await overrideNPMVersionOnLocal(name, dist);
        console.log(
          `Checking local & npm versions for ${name}@${dist}: \n local: ${versions.local_version} \n npm: ${versions.npm_version}`,
        );
        return await execa('yarn', [
          'workspace',
          name,
          'version',
          '--preid=next',
          '--prerelease',
          '--no-git-tag-version',
        ]).then(({ stdout }) => stdout);
      };
      return checkVersionAndIncrease();
    }),
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
  const dist = 'latest';

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
      const checkVersionAndIncrease = async () => {
        await overrideNPMVersionOnLocal(name, dist);
        const nextVersion = nextVersions[name];
        return await execa('yarn', [
          'workspace',
          name,
          'version',
          `--${nextVersion}`,
          '--no-git-tag-version',
        ]).then(({ stdout }) => stdout);
      };

      return checkVersionAndIncrease();
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
    pkgs.map(({ name, location, version }) => {
      let command = ['log', `${since}..HEAD`, '--oneline', '--', location];
      if (!since) {
        command = ['log', '--oneline', '--', location];
      }

      return execa('git', command).then(({ stdout: result }) => {
        return {
          name,
          location,
          version,
          changed: !!result,
        };
      });
    }),
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

export function generateTagName(pkg) {
  return `${packageNameWithoutScope(pkg.name)}@${pkg.version}`;
}

export async function exportNx() {
  const filename = '__output__.json';
  const filepath = join(root, filename);
  await execa('yarn', ['nx', 'graph', '--file', filename]);
  const nxGraph = await importJson(filepath);
  await execa('rm', ['-f', filename]);
  return nxGraph;
}
