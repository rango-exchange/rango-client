export class GithubGetReleaseError extends Error {
  name = 'GithubGetReleaseError';
  constructor(msg) {
    super(msg);
  }
}

export class GithubReleaseNotFoundError extends Error {
  name = 'GithubReleaseNotFoundError';
  constructor(tag) {
    super(`Couldn't find any github release for ${tag}`);
  }
}

export class GithubCreateReleaseFailedError extends Error {
  name = 'GithubCreateReleaseFailedError';
  constructor(msg) {
    super(msg);
  }
}

export class NpmPackageNotFoundError extends Error {
  name = 'NpmPackageNotFoundError';
  constructor(packageName) {
    super(`Couldn't find ${packageName} on NPM.`);
  }
}

export class NpmGetPackageError extends Error {
  name = 'NpmGetPackageError';
  constructor(msg) {
    super(msg);
  }
}

export class NpmPublishError extends Error {
  name = 'NpmPublishError';
  constructor(msg) {
    super(msg);
  }
}

export class IncreaseVersionFailedError extends Error {
  name = 'IncreaseVersionFailedError';
  constructor(msg) {
    super(msg);
  }
}

export class GenerateChangelogFailedError extends Error {
  name = 'GenerateChangelogFailedError';
  constructor(msg) {
    super(msg);
  }
}

export class UnableToProceedPublishError extends Error {
  name = 'UnableToProceedPublishError';
  constructor(msg) {
    super(msg);
  }
}

export class YarnError extends Error {
  name = 'YarnError';
  constructor(msg) {
    super(msg);
  }
}

export class NxError extends Error {
  name = 'NxError';
  constructor(msg) {
    super(msg);
  }
}

export class GitError extends Error {
  name = 'GitError';

  constructor(msg) {
    super(msg);
  }
}

export class CustomScriptError extends Error {
  name = 'CustomScriptError';

  constructor(msg) {
    super(msg);
  }
}
