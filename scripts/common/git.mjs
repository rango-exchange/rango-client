import { execa } from 'execa';
import { PUBLISH_COMMIT_SUBJECT } from './constants.mjs';
import { GitError } from './errors.mjs';
import { detectChannel, getBaseBranchForExperimental } from './github.mjs';
import { should } from './features.mjs';
import { generateTagName, workspacePackages } from './utils.mjs';

export async function isReleaseTagExistFor(pkg) {
  const tag = generateTagName(pkg);

  const result = await execa('git', ['tag', '-l', tag])
    .then((result) => result.stdout)
    .catch((err) => {
      throw new GitError(
        `An error occurred on getting tags \n ${err.message} \n ${err.stderr}`
      );
    });

  const isExist = !!result;
  return isExist;
}

/**
 *
 * @param {import('./typedefs.mjs').Package} pkg
 * @returns {Promise<string | null>}
 */
export async function gitTagFor(pkg) {
  const tagExist = await isReleaseTagExistFor(pkg);

  if (tagExist) {
    const tagName = generateTagName(pkg);
    return tagName;
  }

  return null;
}

/**
 * Get git tags for a list of packages
 * @deprecated
 *
 * @param {Array<import("./typedefs.mjs").Package>} packages
 * @returns {Promise<Array<import("./typedefs.mjs").PackageAndTag>>}
 *
 */
export async function gitTagsFor(packages) {
  const result = packages.map((pkg) => {
    return isReleaseTagExistFor(pkg).then((tagExist) => {
      if (tagExist) {
        const tagName = generateTagName(pkg);

        return {
          package: pkg,
          tag: {
            tagName,
          },
        };
      }

      return {
        package: pkg,
        tag: null,
      };
    });
  });

  return await Promise.all(result);
}

// TODO: Check for when there is no tag.
/**
 *
 * @param {boolean} useTag - if true, we looking up for a git relase tag, if not, we use commit message.
 * @returns {Promise<string>} commit hash
 */
export async function getLastReleasedHashId(useTag = false) {
  if (useTag) {
    const { stdout: hash } = await execa('git', [
      'rev-list',
      '--max-count',
      1,
      '--tags',
    ]);
    return hash.toString();
  } else {
    const { stdout: hash } = await execa('git', [
      'log',
      '--grep',
      '^chore(release): publish',
      '-n',
      1,
      '--pretty=format:%H',
    ]);
    return hash.toString();
  }
}

export async function getBaseBranchCommitHashId(branch) {
  const { stdout: hash } = await execa('git', ['merge-base', branch, 'HEAD']);
  return hash.toString();
}

export async function getLastCommitHashId() {
  const { stdout: hash } = await execa('git', ['rev-parse', 'HEAD']);
  return hash.toString();
}

export async function isBranchAncestorOfHead(branch) {
  const { exitCode } = await execa(
    'git',
    ['merge-base', '--is-ancestor', branch, 'HEAD'],
    {
      reject: false,
    }
  );

  return exitCode === 0;
}

/**
 * Returns a list of changed packages since an specific commit.
 *
 * @param {string} since - commit hash
 * @returns {Promise<import('./typedefs.mjs').Package[]>}
 */
export async function changed(since) {
  const pkgs = await workspacePackages();
  const all = await Promise.all(
    pkgs.map((pkg) => {
      let command = ['log', `${since}..HEAD`, '--oneline', '--', pkg.location];
      if (!since) {
        command = ['log', '--oneline', '--', pkg.location];
      }

      return execa('git', command).then(({ stdout: result }) => {
        return {
          ...pkg,
          changed: !!result,
        };
      });
    })
  );

  // Kepp only changed packages and then clean up the object to remove `changed` property.
  return all.filter((pkg) => pkg.changed).map(({ changed, ...pkg }) => pkg);
}

/**
 * Getting changed packages by passing a distribution channel name.
 *
 * @param {'prod' | 'next' | 'experimental'} channel
 * @returns {Promise<Array<import("./typedefs.mjs").Package>>}
 */
export async function getChangedPackagesFor(channel) {
  let baseCommit;
  if (channel === 'experimental') {
    const branch = getBaseBranchForExperimental();
    const originBranch = `origin/${branch}`;
    if (await isBranchAncestorOfHead(originBranch)) {
      baseCommit = await getBaseBranchCommitHashId(originBranch);
    } else {
      throw new Error('Your branch must be based on `main`.');
    }
  } else {
    // Detect last release and what packages has changed since then.
    const useTagForDetectLastRelease = channel === 'prod';
    baseCommit = await getLastReleasedHashId(useTagForDetectLastRelease);
  }

  const changedPkgs = await changed(baseCommit);

  return changedPkgs;
}

/**
 * Tagging and create a publish commit.
 *
 * @param {import('./typedefs.mjs').Package[]} pkgs
 * @param {string} options.subject - Commit subject
 *
 */
export async function publishCommitAndTags(pkgs) {
  const channel = detectChannel();
  const isTaggingSkipped = !should('createPublishTag');
  const isCommittingSkipped = !should('createPublishCommit');
  const subject = `${PUBLISH_COMMIT_SUBJECT}\n\n`;
  const tags = pkgs.map(generateTagName);

  if (isCommittingSkipped && isTaggingSkipped) {
    console.log('Creating commit and tag for this publish has been skipped.');
    return;
  }

  if (isCommittingSkipped && !isTaggingSkipped) {
    throw new Error(
      'The enviroment has been setup correctly. when tag is enabled, commit should be enabled as well.'
    );
  }

  const list = tags.map((tag) => `- ${tag}`).join('\n');
  const message = subject + list;
  let body = `Affected packages: ${tags.join(',')}`;

  // Making a publish commit
  await commit([message, body], {
    // When we are pushing a publish commit into main or next, it triggers a redundant workflow run,
    // To avoid this, by adding a [skip ci] the workflow run will be skipped.
    shouldSkipCI: true,

    // We need to pass no-verify to bypass commitlint.
    // NOTE: it will bypass precommit and commit-msg hooks.
    shouldVerify: false,
  });

  // Creating annotated tags based on packages
  if (!isTaggingSkipped) {
    await publishTags(pkgs);
  }

  return tags;
}

/**
 * Creates a Git commit with the provided messages.
 *
 * - Supports multiple commit messages by passing them as an array.
 * - Optionally appends `[skip ci]` to the commit message to skip CI pipelines.
 * - Can disable Git hooks verification if `shouldVerify` is set.
 *
 * @param @typedef {string[]}  messages - The commit messages to include.
 * @param {import("./typedefs.mjs").CommitOptions} options - Commit options.
 *
 * @throws {GitError} If the `git commit` command fails.
 */
export async function commit(messages, options) {
  const { shouldVerify, shouldSkipCI } = options;

  const messagesWithCI = shouldSkipCI ? [...messages, '[skip ci]'] : messages;

  const commitArgs = [
    'commit',
    ...messagesWithCI.flatMap((msg) => ['-m', msg]),
    ...(shouldVerify ? [] : ['--no-verify']),
  ];

  try {
    await execa('git', commitArgs);
  } catch (error) {
    throw new GitError(
      `git commit failed. \n ${error.stderr || error.message}`
    );
  }
}
export async function publishTags(pkgs) {
  const tags = pkgs.map(generateTagName);

  // Creating annotated tags based on packages
  await Promise.all(
    tags.map((tag) =>
      execa('git', ['tag', '-a', tag, '-m', tag]).catch((error) => {
        throw new GitError(`git tag failed. \n ${error.stderr}`);
      })
    )
  );

  return tags;
}

export async function addFileToStage(path) {
  await execa('git', ['add', path]).catch((e) => {
    throw new GitError(`"git add" failed. ${e.stderr}`);
  });
}

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
