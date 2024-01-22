import { checkout, merge, pull, push } from '../common/git.mjs';

async function run() {
  // Checkout to `next`
  const checkoutNextOutput = await checkout('next');
  console.log(`Result for: checkout\n`, checkoutNextOutput);

  // Get latest changes from `next`
  const pullNextOutput = await pull();
  console.log(`Result for: pull\n`, pullNextOutput);

  // Checkout to `main`
  const checkoutOutput = await checkout('main');
  console.log(`Result for: checkout\n`, checkoutOutput);

  // Get latest changes from `main`
  const pullOutput = await pull();
  console.log(`Result for: pull\n`, pullOutput);

  // Merge `next` into `main`
  const mergeOutput = await merge('next',{ mergeStrategy: '--no-ff' });
  console.log(`Result for: merge\n`, mergeOutput);

  // Push merged commits to `main`
  const pushOutput = await push();
  console.log(`Result for: push\n`, pushOutput);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
