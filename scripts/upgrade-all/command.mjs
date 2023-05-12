import { $ } from 'execa';
import commandLineArgs from 'command-line-args';
import { getAllPackages, upgradeDepndendentsOf } from './utils.mjs';

async function run() {
  const optionDefinitions = [{ name: 'project', type: String }];
  const { project } = commandLineArgs(optionDefinitions);

  const { stdout: currentBranch } = await $`git branch --show-current`;
  const dist = currentBranch === 'main' ? 'latest' : 'next';

  if (!project) {
    console.log(`you didn't specify any "project". So we will check all the workspace packages.`);
    const packages = await getAllPackages();
    console.log(`All packages (with clients/demos): ${packages.length}`);
    console.log(`Dist channel: ${dist}`);

    await Promise.all(packages.map((project) => upgradeDepndendentsOf(project, dist)));
    return;
  } else {
    console.log(`Running upgrade-all for ${project} \n`);
    console.log(`Dist channel: ${dist}`);
    await upgradeDepndendentsOf(project, dist);
  }

  console.log(`package.json has been updated. Trying to install... \n`);

  const { stdout, stderr } = await $`yarn`;
  console.log(stdout, stderr);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
