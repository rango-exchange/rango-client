import {
  ENABLE_PREVIEW_DEPLOY,
  EXCLUDED_PACKAGES,
  VERCEL_PACKAGES,
} from '../deploy/config.mjs';
import { workspacePackages } from '../common/utils.mjs';

export function getVercelProjectId(packageName) {
  return VERCEL_PACKAGES[packageName];
}

/**
 * Returns packages to be built and deployed based on the `ENABLE_PREVIEW_DEPLOY` environment variable.
 * 
 * Preview mode (ENABLE_PREVIEW_DEPLOY=true): 
 *   Only private packages with configured Vercel project IDs are included.
 * 
 * Production mode (ENABLE_PREVIEW_DEPLOY=false): 
 *   All private packages are included.
 */
export async function getDeployableClients() {
  const packages = await workspacePackages();
  
  const buildableApps = packages.filter((pkg) => {
    // Skip explicitly excluded packages
    if (EXCLUDED_PACKAGES.includes(pkg.name)) return false;

    // Only include private packages
    if (!pkg.private) return false;

    // In preview mode, require a valid Vercel project ID
    if (ENABLE_PREVIEW_DEPLOY) {
      const projectId = getVercelProjectId(pkg.name);
      return projectId && projectId !== 'NOT SET';
    }

    return true;
  });

  return buildableApps;
}