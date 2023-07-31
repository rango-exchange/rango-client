import {
  buildPackages,
  generateChangelog,
  increaseVersionForMain,
  increaseVersionForNext,
  logAsSection,
  makeGithubRelease,
  publishPackages,
} from './utils.mjs';
import { execa } from 'execa';
import { performance } from 'node:perf_hooks';
import { groupPackagesForDeploy } from '../deploy/utils.mjs';

export async function publish(changedPkg, channel) {
  // TODO: If affected pkg, commit a fix: upgrade pkg
  console.log(`::group::Publish ${changedPkg.name} (${channel})`);
  performance.mark(`start-publish-${changedPkg.name}`);

  // 1. Version
  let updatedPackages;
  if (channel === 'prod') {
    updatedPackages = await increaseVersionForMain([changedPkg]);
  } else {
    updatedPackages = await increaseVersionForNext([changedPkg]);
  }

  console.log(
    updatedPackages
      .map(
        (pkg) => `[x] Versioninig: ${pkg.name} (next version: ${pkg.version})`
      )
      .join('\n')
  );

  // 2. Changelog & Github Release
  if (channel === 'prod') {
    await Promise.all(
      updatedPackages.map((pkg) => generateChangelog(pkg, { saveToFile: true }))
    );

    await Promise.all(updatedPackages.map(makeGithubRelease));
    logAsSection(`[x] Github Release & Changelog generated.`);
  }

  // 3. Build & Publish on NPM
  const packages = groupPackagesForDeploy(updatedPackages);
  if (packages.npm.length) {
    performance.mark(`start-publish-build-${changedPkg.name}`);
    await buildPackages(packages.npm);
    performance.mark(`end-publish-build-${changedPkg.name}`);
    const duration_build = performance.measure(
      `publish-build-${changedPkg.name}`,
      `start-publish-build-${changedPkg.name}`,
      `end-publish-build-${changedPkg.name}`
    ).duration;
    logAsSection(`[x] Build for NPM ${duration_build}ms`);
    performance.mark(`start-publish-npm-${changedPkg.name}`);
    const distTag = channel === 'prod' ? 'latest' : 'next';
    await publishPackages(packages.npm, distTag);
    performance.mark(`end-publish-npm-${changedPkg.name}`);
    const duration_npm = performance.measure(
      `publish-npm-${changedPkg.name}`,
      `start-publish-npm-${changedPkg.name}`,
      `end-publish-npm-${changedPkg.name}`
    ).duration;
    logAsSection(`[x] Publish on NPM ${duration_npm}ms`);
  }

  // 5. Yarn upgrade-all
  performance.mark('start-upgrade-all');
  const { stdout: upgradeStdOut } = await execa('yarn', [
    'upgrade-all',
    changedPkg.name,
    '--no-install',
  ]);
  performance.mark('end-upgrade-all');
  const duration_upgrade = performance.measure(
    'upgrade-all',
    'start-upgrade-all',
    'end-upgrade-all'
  ).duration;
  console.log(`::debug::yarn upgrade-all ${changedPkg.name} '--no-install'`);
  console.log(`::debug::${upgradeStdOut}`);
  logAsSection(`[x] Upgrade all package users. ${duration_upgrade}ms`);

  performance.mark(`end-publish-${changedPkg.name}`);
  const duration_publish = performance.measure(
    `publish-${changedPkg.name}`,
    `start-publish-${changedPkg.name}`,
    `end-publish-${changedPkg.name}`
  ).duration;
  console.log(`Execution time: ${duration_publish}ms`);
  console.log(`::endgroup::`);

  return updatedPackages[0];
}
