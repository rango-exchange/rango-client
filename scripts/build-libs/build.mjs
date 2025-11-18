import { execa } from 'execa';
import { NxError } from '../common/errors.mjs';
import { packagePath } from '../common/path.mjs';
import concurrently from 'concurrently';

export async function build(pkgs, focus = false) {
  performance.mark(`start-ci-build`);
  if (focus) {
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
  const projects = pkgs.map((pkg) => pkg.name).join(',');
  await execa('yarn', [
    'nx',
    'run-many',
    '--target',
    'build',
    '--projects',
    projects,
  ])
    .then(({ stdout }) => stdout)
    .catch((err) => {
      throw new NxError(err.stderr + err.stdout);
    });
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
