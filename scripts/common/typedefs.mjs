/**
 * Packages that has been changed since a specific commit/tag
 *
 * @typedef {Object} Package
 * @property {string} name - The name of the package.
 * @property {string} location - The location of the package.
 * @property {string} version - The version of the package.
 * @property {boolean} private - Whether the package is private or not.
 */

/**
 * @typedef {Object} Release
 * @property {string} tagName - The name of the package followed by version.
 */

/**
 * @typedef {Object} Tag
 * @property {string} tagName - The name of the package followed by version.
 */

/**
 * @typedef {Object} PackageAndRelease
 * @property {Package} package
 * @property {Release | null} release
 */

/**
 * @typedef {Object} PackageAndTag
 * @property {Package} package
 * @property {Tag | null} tag
 */

/**
 * @typedef {Object} NpmVersions
 * @property {string} next - last next release version
 * @property {string} prod - last prod release version
 */

/**
 * @typedef {Object} PackageAndNpmVersions
 * @property {Package} package
 * @property {NpmVersions | null} npm
 */

/**
 * @typedef {Object} IncreaseVersionResult
 * @property {string} current - current version
 * @property {string} next - increased version
 */
