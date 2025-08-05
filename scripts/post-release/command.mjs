import { checkout, merge, pull, push } from '../common/git.mjs';

async function run() {
  // Make sure we are on main and having latest changes
  await checkout('main');
  await pull();

  // Merge phase
  await checkout('next');
  await pull();
  
  await merge('main', {
    mergeStrategy: '--no-ff',
    messages: ['chore: sync next with main', '[skip ci]'],
  });

  await push();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
