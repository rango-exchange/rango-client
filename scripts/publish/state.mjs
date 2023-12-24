export class State {
  /** @type {import('../common/typedefs.mjs').Package[]}  */
  pkgs = [];
  /** @type {Object.<string, import('./typedefs.mjs').PackageState>}  */
  state = {};

  /** @param {import('../common/typedefs.mjs').Package[]} pkgs */
  constructor(pkgs) {
    this.pkgs = pkgs;
  }

  toJSON() {
    const output = {
      pkgs: this.pkgs,
      state: this.state,
    };

    return JSON.stringify(output);
  }

  /**
   *
   * Get packages in state **with latest version**.
   *
   * @returns {import('../common/typedefs.mjs').Package[]}
   */
  list() {
    return this.pkgs.map((pkg) => {
      return {
        ...pkg,
        version: this.getState(pkg.name, 'version'),
      };
    });
  }

  /**
   *
   * @param {string} pkgName
   * @param {"gitTag" | "githubRelease" | "npmVersion" | "version" | undefined} name
   */
  getState(pkgName, name) {
    if (!this.state[pkgName]) {
      return undefined;
    }

    // Return whole state
    if (!name) {
      return this.state[pkgName];
    }

    return this.state[pkgName][name];
  }

  /**
   *
   * @param {string} pkgName
   * @param {"gitTag" | "githubRelease" | "npmVersion" | "version"} name
   * @param {string} value
   */
  setState(pkgName, name, value) {
    if (!this.state[pkgName]) {
      this.state[pkgName] = {};
    }

    this.state[pkgName][name] = value;
  }
}
