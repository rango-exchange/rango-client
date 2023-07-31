import chalk from 'chalk';
import { execa } from 'execa';
import { join } from 'path';
import conventionanRecommendBump from 'conventional-recommended-bump';
import {
  getEnvWithFallback,
  packageNameWithoutScope,
  printDirname,
  workspacePackages,
} from '../common/utils.mjs';
import { importJson } from '../common/graph/helpers.mjs';
import { overrideNPMVersionOnLocal } from '../common/npm.mjs';
const root = join(printDirname(), '..', '..');

export async function generateChangelog(pkg, options) {
  const { saveToFile } = options;
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

  const { stdout: bin } = await execa('yarn', [
    'bin',
    'conventional-changelog',
  ]);
  const { stdout } = await execa(bin, command);
  return stdout;
}

export async function makeGithubRelease(updatedPkg) {
  const notes = await generateChangelog(updatedPkg, {
    saveToFile: false,
  });
  const tag = generateTagName(updatedPkg);
  await execa('gh', [
    'release',
    'create',
    tag,
    '--target',
    'main',
    '--notes',
    notes,
  ]);
}

export async function packageNamesToPackagesWithInfo(names) {
  const allPackages = await workspacePackages();
  return names.map((pkgName) =>
    allPackages.find((pkg) => pkg.name === pkgName)
  );
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
      }
    );
  });
}

export async function publishPackages(updatedPkgs, dist = 'next') {
  const result = await Promise.all(
    updatedPkgs.map(({ location }) =>
      execa('yarn', ['publish', location, '--tag', dist]).then(
        ({ stdout }) => stdout
      )
    )
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

export async function tagPackagesAndCommit(
  updatedPackages,
  { skipGitTagging }
) {
  const tags = updatedPackages.map(generateTagName);

  const subject = `chore(release): publish\n\n`;
  const list = tags.map((tag) => `- ${tag}`).join('\n');
  const message = subject + list;

  // making a publish commit
  const { stdout: diffOutput } = await execa('git', ['diff', '--stat']).catch(
    (e) => {
      return e;
    }
  );
  console.log(`::debug::git_diff: ${diffOutput}`);

  await execa('git', ['add', '.']);
  await execa('git', [
    'commit',
    '-m',
    message,
    '-m',
    `Affected packages: ${tags.join(',')}`,
  ]);

  // creating annotated tags based on packages
  if (!skipGitTagging) {
    await Promise.all(
      tags.map((tag) => execa('git', ['tag', '-a', tag, '-m', tag]))
    );
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
          `Checking local & npm versions for ${name}@${dist}: \n local: ${versions.local_version} \n npm: ${versions.npm_version}`
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
    })
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
          console.log(`::debug::${{ name, recommendation }}`);
          nextVersions[name] = recommendation.releaseType;
        })
      )
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
    })
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
    })
  );
  return all.filter((pkg) => pkg.changed);
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
    const { stdout: hash } = await execa('git', [
      'rev-list',
      '--max-count',
      1,
      '--tags',
    ]);
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

export function logAsSection(title, sub = '') {
  let message = chalk.bgBlue.white.bold(title);
  if (!!sub) {
    message += ' ';
    message += sub;
  }
  console.log(message);
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
