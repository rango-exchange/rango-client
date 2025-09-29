import { checkout, merge, pull, push } from '../common/git.mjs';
import commandLineArgs from 'command-line-args';
async function syncBranch(sourceBrach, targetBranch) {
  // Checkout to source branch
  const checkoutSourceOutput = await checkout(sourceBrach);
  console.log(`Result for: checkout\n`, checkoutSourceOutput);

  // Get latest changes from source branch
  const pullSourceOutput = await pull();
  console.log(`Result for: pull\n`, pullSourceOutput);

  // Checkout to target branch
  const checkoutTargetOutput = await checkout(targetBranch);
  console.log(`Result for: checkout\n`, checkoutTargetOutput);

  // Get latest changes from target branch
  const pullTargetOutput = await pull();
  console.log(`Result for: pull\n`, pullTargetOutput);

  // Merge `next` into `main`
  const mergeOutput = await merge(sourceBrach, {
    mergeStrategy: '--no-ff',
    messages: [`chore(release): sync ${targetBranch} with ${sourceBrach}`, '[skip ci]'],
  });
  console.log(`Result for: merge\n`, mergeOutput);

  // Push merged commits to target branch
  const pushOutput = await push();
  console.log(`Result for: push\n`, pushOutput);
}

async function run() {
  const optionDefinitions = [
    { name: 'prod', type: Boolean, defaultOption: false },
  ];

  const { prod } = commandLineArgs(optionDefinitions);
  if (prod) {
    await syncBranch('next', 'main');
    return;
  }
  await syncBranch('main', 'next');
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
