import { $ } from 'execa';

async function run() {
  // Checkout to `next`
  const { stdout: checkoutNextOutput } = await $`git checkout next`;
  console.log(`Result for: checkout\n`, checkoutNextOutput);

  // Get latest changes from `next`
  const { stdout: pullNextOutput } = await $`git pull`;
  console.log(`Result for: checkout\n`, pullNextOutput);

  // Checkout to `main`
  const { stdout: checkoutOutput } = await $`git checkout main`;
  console.log(`Result for: checkout\n`, checkoutOutput);

  // Get latest changes from `main`
  const { stdout: pullOutput } = await $`git pull`;
  console.log(`Result for: pull\n`, pullOutput);

  // Merge `next` into `main`
  const { stdout: mergeOutput } = await $`git merge next`;
  console.log(`Result for: merge\n`, mergeOutput);

  // Push merged commits to `main`
  const { stdout: pushOutput } = await $`git push`;
  console.log(`Result for: push\n`, pushOutput);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
