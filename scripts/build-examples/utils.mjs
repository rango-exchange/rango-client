import path from 'node:path';
import { EXAMPLES_PATH } from './config.mjs';
import { packageJson, workspacePackages } from '../common/utils.mjs';
import { WIDGET_EMBEDDED_PACKAGE_NAME } from '../deploy/config.mjs';
import { packagePath } from '../common/path.mjs';
export function getExamplePath(packageName) {
  return path.join(EXAMPLES_PATH, packageName);
}
export async function getCurrentWidgetEmbeddedVersion() {
  const packages = await workspacePackages();
  return packages.find((pkg) => pkg.name === WIDGET_EMBEDDED_PACKAGE_NAME)
    .version;
}
