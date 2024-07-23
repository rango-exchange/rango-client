import commandLineArgs from 'command-line-args';
import * as esbuild from 'esbuild';
import { $ } from 'execa';
import { join } from 'path';
import process from 'process';
import {
  packageJson,
  packageNameWithoutScope,
  printDirname,
} from '../common/utils.mjs';
import fs from 'fs/promises';
import { BUILD_META_FILE_SUFFIX } from '../common/constants.mjs';

const root = join(printDirname(), '..', '..');

async function run() {
  const optionDefinitions = [
    { name: 'path', type: String },
    // It accepts a comma separated file paths. e.g. src/main.ts,src/net.ts
    { name: 'inputs', type: String },
  ];
  const { path, inputs } = commandLineArgs(optionDefinitions);

  if (!path) {
    throw new Error('You need to specify package name.');
  }

  const pkgPath = `${root}/${path}`;
  const entryPoint = `${pkgPath}/src/index.ts`;
  const packageName = packageNameWithoutScope(packageJson(path).name);

  let entryPoints = [];
  if (!inputs) {
    entryPoints = [`${pkgPath}/src/index.ts`];
  } else {
    entryPoints = inputs.split(',').map((input) => `${pkgPath}/${input}`);
  }

  console.log(`[build] Running for ${path}`);

  const typeCheckingTask = $({
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
    entryPoints: entryPoints,
    metafile: true,
  });
  const result = await Promise.all([typeCheckingTask, esbuildTask]);
  console.log(`[build] ${path} built successfully.`);

  await fs.writeFile(
    `dist/${packageName}${BUILD_META_FILE_SUFFIX}`,
    JSON.stringify(result[1].metafile)
  );
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
