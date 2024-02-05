import { checkout, merge, pull, push } from '../common/git.mjs';
import { checkCommitAndGetPkgs } from './tag.mjs';

async function run() {
  // Make sure we are on main and having latest changes
  await checkout('main');
  await pull();

  await checkCommitAndGetPkgs();

  // Merge phase
  await checkout('next');
  await pull();
  await merge('main', { mergeStrategy: '--no-ff' });
  await push();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
