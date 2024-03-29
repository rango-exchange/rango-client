import { $ } from 'execa';
import commandLineArgs from 'command-line-args';
import { getAllPackages, upgradeDepndendentsOf } from './utils.mjs';

async function run() {
  const optionDefinitions = [
    { name: 'project', type: String },
    { name: 'no-install', type: Boolean, defaultOption: false },
    { name: 'version', type: String, defaultOption: '' },
  ];
  const { project, noInstall, version } = commandLineArgs(optionDefinitions, {
    camelCase: true,
  });

  const { stdout: currentBranch } = await $`git branch --show-current`;
  const dist = currentBranch === 'main' ? 'latest' : 'next';

  if (!project && !!version) {
    throw new Error(
      `To set a fixed "version," you must provide the "project" parameter. project=${project}, version=${version}`
    );
  }

  if (!project) {
    console.log(
      `you didn't specify any "project". So we will check all the workspace packages.`
    );
    const packages = await getAllPackages();
    console.log(`All packages (with clients/demos): ${packages.length}`);
    console.log(`Dist channel: ${dist}`);

    // TODO: using Promise.all to run in parallel will speed up the proccess
    // but it has lock/unlock issue with fs write/read and can not be used reliably.
    for (const project of packages) {
      await upgradeDepndendentsOf(project, dist);
    }
  } else {
    console.log(`Running upgrade-all for ${project} \n`);
    console.log(`Dist channel: ${dist}`);
    await upgradeDepndendentsOf(project, dist, version);
  }

  if (!noInstall) {
    console.log(`package.json has been updated. Trying to install... \n`);
    const { stdout, stderr } = await $`yarn`;
    console.log(stdout, stderr);
  }
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
