import { $ } from 'execa';
import commandLineArgs from 'command-line-args';
import { updateVersion } from './utils.mjs';

async function run() {
  const optionDefinitions = [{ name: 'project', type: String }];
  const { project } = commandLineArgs(optionDefinitions);

  const currentBranch = await $`git branch --show-current`;
  const dist = currentBranch === 'main' ? 'latest' : 'next';

  console.log(`Running upgrade-all for ${project}@${dist} \n`);

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

  if (dependents.length === 0) throw new Error(`It seems ${project} isn't used by any packages.`);

  console.log(`These packages are using ${project}: ${dependents.join(',')} \n`);

  const { stdout: npmInfo } = await $`yarn info ${project}@${dist} --json`;
  const versions = JSON.parse(npmInfo).data['dist-tags'];
  const version = versions[dist];

  console.log(`NPM version for ${project} is ${version}. \n`);

  await Promise.all(
    dependents.map((pkg) =>
      updateVersion({ path: workspaces[pkg].location }, { name: project, version }),
    ),
  );

  console.log(`package.json has been updated. Trying to install... \n`);

  const { stdout, stderr } = await $`yarn`;
  console.log(stdout, stderr);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
