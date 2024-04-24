import { getEnvWithFallback } from '../common/utils.mjs';
import process from 'node:process';

const scope = `@rango-dev`;
export const VERCEL_ORG_ID = process.env.VERCEL_ORG_ID;
export const VERCEL_TOKEN = process.env.VERCEL_TOKEN;
export const ENABLE_PREVIEW_DEPLOY = process.env.ENABLE_PREVIEW_DEPLOY;
export const EXCLUDED_PACKAGES = ['@rango-dev/widget-iframe'];

export const VERCEL_PACKAGES = {
  [`${scope}/wallets-demo`]: getEnvWithFallback('VERCEL_PROJECT_WALLETS'),
  [`${scope}/queue-manager-demo`]: getEnvWithFallback('VERCEL_PROJECT_Q'),
  [`${scope}/wallets-adapter-demo`]: getEnvWithFallback(
    'VERCEL_PROJECT_WALLET_ADAPTER'
  ),
  [`${scope}/widget-playground`]: getEnvWithFallback(
    'VERCEL_PROJECT_WIDGET_CONFIG'
  ),
  [`${scope}/widget-app`]: getEnvWithFallback('VERCEL_PROJECT_WIDGET_APP'),
  [`${scope}/storybook`]: getEnvWithFallback('VERCEL_PROJECT_STORYBOOK'),
};
