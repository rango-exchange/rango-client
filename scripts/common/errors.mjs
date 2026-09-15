export class GithubCommandError extends Error {
  name = 'GithubCommandError';
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

export class CrowdinError extends Error {
  name = 'CrowdinError';
  constructor(msg) {
    super(msg);
  }
}

export class VercelError extends Error {
  name = 'VercelError';
  constructor(msg) {
    super(msg);
  }
}

