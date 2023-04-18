import { $ } from 'execa';
import { join } from 'node:path';
import commandLineArgs from 'command-line-args';
import { printDirname } from '../common/utils.mjs';

const cwd = join(printDirname(), '..', '..');

async function run() {
  const optionDefinitions = [{ name: 'project', type: String }];
  const { project } = commandLineArgs(optionDefinitions);

  const currentBranch = await $`git branch --show-current`;
  const dist = currentBranch === 'main' ? 'latest' : 'next';
  
  console.log(`upgrading to ${project}@${dist}`);

  if (!project) throw '`project` is required';

  const { stdout: info } = await $`yarn workspaces info`;
  const workspaces = JSON.parse(info);

  // Going through all workspace and find packages which depends on `project`
  const dependents = [];
  const pkgs = Object.keys(workspaces);
  pkgs.forEach((pkg) => {
    if (
      workspaces[pkg].workspaceDependencies.includes(project) ||
      workspaces[pkg].mismatchedWorkspaceDependencies.includes(project)
    ) {
      dependents.push(pkg);
    }
  });

  console.log(`Upgrade will be run on: ${dependents}`);
  await Promise.all(
    dependents.map((pkg) => $({ cwd })`yarn workspace ${pkg} add ${project}@${dist}`),
  );
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
