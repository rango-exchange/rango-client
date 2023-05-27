import { $ } from 'execa';
import commandLineArgs from 'command-line-args';
import { getAllPackages, upgradeDepndendentsOf } from './utils.mjs';

async function run() {
  const optionDefinitions = [
    { name: 'project', type: String },
    { name: 'no-install', type: Boolean, defaultOption: false },
  ];
  const { project, noInstall } = commandLineArgs(optionDefinitions, { camelCase: true });

  const { stdout: currentBranch } = await $`git branch --show-current`;
  const dist = currentBranch === 'main' ? 'latest' : 'next';

  if (!project) {
    console.log(`you didn't specify any "project". So we will check all the workspace packages.`);
    const packages = await getAllPackages();
    console.log(`All packages (with clients/demos): ${packages.length}`);
    console.log(`Dist channel: ${dist}`);

    await Promise.all(packages.map((project) => upgradeDepndendentsOf(project, dist)));
  } else {
    console.log(`Running upgrade-all for ${project} \n`);
    console.log(`Dist channel: ${dist}`);
    await upgradeDepndendentsOf(project, dist);
  }

  console.log(`package.json has been updated. Trying to install... \n`);

  if (!noInstall) {
    const { stdout, stderr } = await $`yarn`;
    console.log(stdout, stderr);
  }
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
