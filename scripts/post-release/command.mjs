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

  // Commit changes with a "skip ci" flag to prevent triggering CI pipelines for this sync merge.
  // "--no-verify" is used to bypass commit hooks (e.g., commitlint, pre-commit).
  await execa('git', [
    'commit',
    '-m',
    'chore: sync next with main',
    '-m',
    '[skip ci]',
    '--no-verify',
  ]).catch((error) => {
    throw new GitError(`git commit failed. \n ${error.stderr}`);
  });

  await push();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
