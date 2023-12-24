import { execa } from 'execa';
import { generateChangelog } from './changelog.mjs';
import {
  GithubCreateReleaseFailedError,
  GithubGetReleaseError,
  GithubReleaseNotFoundError,
} from './errors.mjs';
import { should } from './features.mjs';
import { generateTagName, getEnvWithFallback } from './utils.mjs';

/**
 *
 * @param {import("./typedefs.mjs").Package} pkg
 * @returns {Promise<import("./typedefs.mjs").Release>}
 *
 */
export async function getGithubReleaseFor(pkg) {
  const tag = generateTagName(pkg);

  const result = await execa('gh', [
    'release',
    'view',
    tag,
    '--json',
    'tagName',
  ]).catch((err) => {
    if (err.stderr === 'release not found') {
      throw new GithubReleaseNotFoundError(tag);
    }
    throw new GithubGetReleaseError(err.message);
  });

  const release = JSON.parse(result.stdout);

  return release;
}

/**
 * Generate changelog for a package and making a release on Github.
 * @param {import('./typedefs.mjs').Package} pkg
 */
export async function makeGithubRelease(pkg) {
  const notes = await generateChangelog(pkg, {
    saveToFile: false,
  });
  const tagName = generateTagName(pkg);
  const output = await execa('gh', [
    'release',
    'create',
    tagName,
    '--target',
    'main',
    '--notes',
    notes,
    '--verify-tag',
  ])
    .then(({ stdout }) => stdout)
    .catch((err) => {
      throw new GithubCreateReleaseFailedError(err.stdout);
    });

  return output;
}

/**
 * Get a package and try to get a github release with same (tag) name.
 * Returns null if any release not found.
 *
 * @param {import('./typedefs.mjs').Package} pkg
 * @returns {Promise<string | null>}
 */
export async function githubReleaseFor(pkg) {
  try {
    const release = await getGithubReleaseFor(pkg);
    return release.tagName;
  } catch (err) {
    if (err instanceof GithubReleaseNotFoundError) {
      return null;
    }

    throw err;
  }
}

export function checkEnvironments() {
  const envs = {
    NPM_TOKEN: !!process.env.NPM_TOKEN,
    REF: !!process.env.REF,
    BASE_REF: process.env.BASE_REF,
    GH_TOKEN: !!process.env.GH_TOKEN,
    VERCEL_ORG_ID: !!process.env.VERCEL_ORG_ID,
    VERCEL_TOKEN: !!process.env.VERCEL_TOKEN,
    VERCEL_PROJECT_WALLETS: !!process.env.VERCEL_PROJECT_WALLETS,
    VERCEL_PROJECT_Q: !!process.env.VERCEL_PROJECT_Q,
    VERCEL_PROJECT_WALLET_ADAPTER: !!process.env.VERCEL_PROJECT_WALLET_ADAPTER,
    VERCEL_PROJECT_WIDGET_CONFIG: !!process.env.VERCEL_PROJECT_WIDGET_CONFIG,
    VERCEL_PROJECT_WIDGET_APP: !!process.env.VERCEL_PROJECT_WIDGET_APP,
  };

  const features = [
    { name: 'check github release', value: should('checkGithubRelease') },
    { name: 'check git tags', value: should('checkGitTags') },
    { name: 'check versions on npm', value: should('checkNpm') },
  ];

  console.log('Environments Variables:');
  console.table(envs);
  console.log('Features:');
  console.table(features);
}

export function detectChannel() {
  if (getEnvWithFallback('REF') === 'refs/heads/main') {
    return 'prod';
  }
  return 'next';
}
