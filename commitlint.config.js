const Configuration = {
  extends: ['@commitlint/config-conventional'],

  // Release commits list every published package, far past `body-max-line-length`.
  ignores: [(msg) => /^chore\(release\):/.test(msg)],
};

module.exports = Configuration;
