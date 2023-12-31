import { execa } from 'execa';
import { logAsSection } from '../publish/utils.mjs';
import { detectChannel } from '../common/github.mjs';
import parser from 'conventional-commits-parser';
import filter from 'conventional-commits-filter';

async function run() {
  const channel = detectChannel();

  logAsSection('Run...', `at ${channel}..HEAD`);

  const { stdout: logs } = await execa('git', [
    'log',
    `origin/${channel}..HEAD`,
    '--pretty=format:%B__________',
  ]);
  const commits = logs.split('__________').filter(Boolean);
  const parsedCommits = filter(commits.map(parser.sync));
  const hasAnyConventionalCommit = parsedCommits.some(
    (commit) => !!commit.type
  );

  if (hasAnyConventionalCommit) {
    console.log('found a conventional commit.');
    console.debug(parsedCommits);
  } else {
    throw new Error('There is no conventional commit. you need at least one.');
  }
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
