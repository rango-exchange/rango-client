import { execa } from 'execa';
import { CustomScriptError, GitError } from './errors.mjs';

export async function push(options) {
  const { setupRemote, branch, remote = 'origin' } = options || {};

  let pushOptions = [];
  if (setupRemote) {
    if (!branch) {
      throw new CustomScriptError(
        `You should also pass branch name as parameter to push. \n ${error.stderr}`
      );
    }

    pushOptions = ['--set-upstream', remote, branch];
  } else {
    pushOptions = [remote, '--follow-tags', '--no-verify', '--atomic'];
  }

  const output = await execa('git', ['push', ...pushOptions])
    .then(({ stdout }) => stdout)
    .catch((error) => {
      throw new GitError(`git push failed. \n ${error.stderr}`);
    });

  return output;
}

export async function pull(remote = 'origin') {
  const output = await execa('git', ['pull', remote])
    .then(({ stdout }) => stdout)
    .catch((error) => {
      throw new GitError(`git pull failed. \n ${error.stderr}`);
    });

  return output;
}

export async function checkout(branch) {
  const output = await execa('git', ['checkout', branch])
    .then(({ stdout }) => stdout)
    .catch((error) => {
      throw new GitError(`git checkout failed. \n ${error.stderr}`);
    });

  return output;
}

export async function merge(branch, mergeOptions) {
  const { mergeStrategy = '', messages = [] } = mergeOptions;
  const messagesWithSwitch = messages.flatMap((message) => ['-m', message]);

  const output = await execa('git', [
    'merge',
    mergeStrategy,
    branch,
    ...messagesWithSwitch,
  ])
    .then(({ stdout }) => stdout)
    .catch((error) => {
      throw new GitError(`git merge failed. \n ${error.stderr}`);
    });

  return output;
}

export async function getLastCommitId() {
  const commitId = await execa('git', ['log', '--format=%s', '-n', 1])
    .then(({ stdout }) => stdout)
    .catch((e) => {
      throw new GitError(
        `Getting last commit using git log failed \n ${e.stderr}`
      );
    });

  return commitId;
}

export async function getLastCommitSubject() {
  const commitId = await execa('git', ['log', '--format=%s', '-n', 1])
    .then(({ stdout }) => stdout)
    .catch((e) => {
      throw new GitError(
        `Getting last commit using git log failed \n ${e.stderr}`
      );
    });

  return commitId;
}

export async function getLastCommitMessage() {
  const commitId = await execa('git', ['log', '--format=%B', '-n', 1])
    .then(({ stdout }) => stdout)
    .catch((e) => {
      throw new GitError(
        `Getting last commit using git log failed \n ${e.stderr}`
      );
    });

  return commitId;
}
