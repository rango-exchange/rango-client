import fs from 'node:fs/promises';
import { join } from 'node:path';
import { printDirname } from '../common/utils.mjs';

const cwd = join(printDirname(), '..', '..');

export async function updateVersion(target, upgrade) {
  const { path } = target;
  const { name, version } = upgrade;
  const pkgPath = join(cwd, path, 'package.json');

  const pkgJson = await fs.readFile(pkgPath, { encoding: 'utf8' });
  const updatedPkgJson = JSON.parse(pkgJson);
  if (updatedPkgJson['dependencies'][name]) {
    updatedPkgJson['dependencies'][name] = `^${version}`;
  } else if (updatedPkgJson['devDependencies'][name]) {
    updatedPkgJson['devDependencies'][name] = `^${version}`;
  } else {
    throw new Error(`${name} not found, neither dependencies or devDependencies.`);
  }

  await fs.writeFile(pkgPath, JSON.stringify(updatedPkgJson, null, 2));
}
