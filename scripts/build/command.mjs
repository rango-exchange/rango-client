import commandLineArgs from 'command-line-args';
import * as esbuild from 'esbuild';
import { join } from 'path';
import { packageNamesToPackagesWithInfo, printDirname } from '../common/utils.mjs';

const root = join(printDirname(), '..', '..');

async function run() {
  const optionDefinitions = [{ name: 'project', type: String }];
  const { project } = commandLineArgs(optionDefinitions);

  if (!project) {
    throw new Error('You need to specify package name.');
  }

  const packages = await packageNamesToPackagesWithInfo([project]);
  if (!packages.length) {
    throw new Error('Make sure you are passing correct package name.');
  }
  const pkg = packages[0];
  const entryPoint = `${root}/${pkg.location}/src/index.ts`;

  console.log(`[build] Running for ${project}`);
  await esbuild.build({
    //  --outdir=dist
    bundle: true,
    minify: true,
    keepNames: true,
    sourcemap: true,
    platform: 'node',
    format: 'esm',
    packages: 'external',
    outdir: `${pkg.location}/dist`,
    entryPoints: [entryPoint],
  });
  console.log(`[build] ${project} built successfully.`);
}

run();
