import { detectChannel } from './github.mjs';

/**
 *  Features configurations
 *
 * Note 1: Please add to `checkEnvironments` proper values when you add something to this object.
 * Note 2: Pass distribution channel as value.
 *
 */
const config = {
  generateChangelog: ['prod'],
  checkGithubRelease: ['prod'],
  checkGitTags: ['prod'],
  checkNpm: ['prod', 'next'],
};

/**
 *
 * Check a config and returns `true` if should do anything.
 *
 * @param {*} key
 * @returns
 */
export function should(key) {
  const channel = detectChannel();

  if (config[key].includes(channel)) {
    return true;
  }

  return false;
}
