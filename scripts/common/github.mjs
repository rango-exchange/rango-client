import { execa } from 'execa';
import { GithubCommandError } from './errors.mjs';
import { getEnvWithFallback } from './utils.mjs';

/**
 *
 * @param {PullRequestInfo} pr
 *
 * @typedef {Object} PullRequestInfo
 * @property {string} title PR title
 * @property {string} branch your current branch
 * @property {string} baseBranch PR will be merge into base branch.
 * @property {string} templatePath template path for PR
 *
 */
export async function createPullRequest(pr) {
  const { title, baseBranch, branch, templatePath } = pr;

  if (!title || !baseBranch || !branch || !templatePath) {
    throw new GithubCommandError(
      'Creating pull request can not be proceed without required parameters. \n',
      JSON.stringify({ title, baseBranch, branch, templatePath })
    );
  }

  const ghCreateParams = [
    '--title',
    title,
    '--base',
    baseBranch,
    '--head',
    branch,
    '--body-file',
    templatePath,
  ];
  const output = await execa('gh', ['pr', 'create', ...ghCreateParams])
    .then(({ stdout }) => stdout)
    .catch((err) => {
      throw new GithubCommandError(
        `gh pr command failed. \n ${err.stdout || err} \n`
      );
    });

  return output;
}

export async function createComment(comment) {
  const {commentBody, issueNumber} = comment;

  if (!issueNumber || !commentBody) {
    throw new GithubCommandError(
      'Creating comment cannot proceed without required parameters. \n',
      JSON.stringify({ issueNumber, commentBody })
    );
  }

    const output = await execa('gh', ['issue', 'comment', issueNumber, '--body', commentBody])
    .then(({ stdout }) => stdout)
    .catch((err) => {
      throw new GithubCommandError(
        `Failed to add comment to issue. \n ${err.stdout || err} \n`
      );
    });

    return output;
}

// All the experimental releases should be a branch of `main`, if this policy changed (like publish from other base branches like `next`), we can add it here.
export function getBaseBranchForExperimental() {
  return 'main';
}

export function detectChannel() {
  if (getEnvWithFallback('REF') === 'refs/heads/main') {
    return 'prod';
  } else if (getEnvWithFallback('REF') === 'refs/heads/next') {
    return 'next';
  }
  return 'experimental';
}
