import { execa } from 'execa';
import { NxError } from '../common/errors.mjs';
import { packagePath } from '../common/path.mjs';
import concurrently from 'concurrently';

export async function ciBuild(pkgs, prebuiltLibs = false) {
  performance.mark(`start-ci-build`);
  if (prebuiltLibs) {
    await buildPackages(pkgs);
  } else {
    await buildWithDependencies(pkgs);
  }
  performance.mark(`end-ci-build`);
  const duration_build = performance.measure(
    `ci-build`,
    `start-ci-build`,
    `end-ci-build`
  ).duration;
  console.log(`Built. ${duration_build}ms`);
  return;
}
async function buildWithDependencies(pkgs) {
  const PARALLEL_PROCESSS_NUMBER = '20';
  const projects = pkgs.map((pkg) => pkg.name).join(',');
  const result = await execa('yarn', [
    'nx',
    'run-many',
    '--target',
    'build',
    '--projects',
    projects,
    '--parallel',
    PARALLEL_PROCESSS_NUMBER,
  ])
    .then(({ stdout }) => stdout)
    .catch((err) => {
      throw new NxError(err.stderr + err.stdout);
    });

  console.log(result);
}
async function buildPackages(pkgs) {
  const commands = pkgs.map((pkg) => {
    const location = packagePath(pkg.location);
    return {
      command: `yarn --cwd ${location} build`,
      name: pkg.name,
    };
  });

  const { result } = concurrently(commands, {
    prefix: 'name',
    killOthers: ['failure'],
  });

  await result;
}
