import commandLineArgs from 'command-line-args';
import * as esbuild from 'esbuild';
import { $ } from 'execa';
import { join } from 'path';
import process from 'process';
import { printDirname } from '../common/utils.mjs';

const root = join(printDirname(), '..', '..');

async function run() {
  const optionDefinitions = [{ name: 'path', type: String }];
  const { path } = commandLineArgs(optionDefinitions);

  if (!path) {
    throw new Error('You need to specify package name.');
  }

  const pkgPath = `${root}/${path}`;
  const entryPoint = `${pkgPath}/src/index.ts`;

  console.log(`[build] Running for ${path}`);

  const typeCheckingTask = await $({
    cwd: pkgPath,
    stderr: process.stderr,
    stdout: process.stdout,
  })`tsc --declaration --emitDeclarationOnly`;
  const esbuildTask = esbuild.build({
    bundle: true,
    minify: true,
    keepNames: true,
    sourcemap: true,
    platform: 'node',
    format: 'esm',
    packages: 'external',
    outdir: `${pkgPath}/dist`,
    entryPoints: [entryPoint],
  });
  await Promise.all([typeCheckingTask, esbuildTask]);
  console.log(`[build] ${path} built successfully.`);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
