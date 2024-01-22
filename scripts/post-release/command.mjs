import { checkout, pull } from '../common/git.mjs';
import { createPullRequest } from '../common/github.mjs';

async function run() {
  // Make sure we are on main and having latest changes
  await checkout('main');
  await pull();

  await createPullRequest({
    title: '🤖 Post Release',
    branch: 'main',
    baseBranch: 'next',
    templatePath: '.github/PUBLISH_TEMPLATE.md',
  });
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
