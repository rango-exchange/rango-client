import commandLineArgs from 'command-line-args';
import * as esbuild from 'esbuild';
import { $ } from 'execa';
import process from 'process';
import { nodeModulesPolyfillPlugin } from 'esbuild-plugins-node-modules-polyfill';
import {
  packageJson,
  packageNameWithoutScope,
} from '../common/utils.mjs';
import fs from 'fs/promises';
import { BUILD_META_FILE_SUFFIX } from '../common/constants.mjs';
import { packagePath } from '../common/path.mjs';


async function run() {
  const optionDefinitions = [
    { name: 'path', type: String },
    // It accepts a comma separated file paths. e.g. src/main.ts,src/net.ts
    { name: 'inputs', type: String },
    // Comma separated list. https://esbuild.github.io/api/#external
    { name: 'external', type: String },
    // When you want to make all the packages external, and only include some specific packages as your library bundle, this will be usefull.
    // Comma separated.
    { name: 'external-all-except', type: String },
    // Enable code splitting
    { name: 'splitting', type: Boolean },
  ];

  const {
    path,
    inputs,
    external,
    'external-all-except': externalAllExcept,
    splitting,
  } = commandLineArgs(optionDefinitions);

  if (!path) {
    throw new Error('You need to specify package name.');
  }

  if (!!external && !!externalAllExcept)
    throw new Error(
      'You should only use one of `external` or `external-all-except` at the sametime.'
    );

  const pkgPath = packagePath(path);
  const pkg = packageJson(path);
  const packageName = packageNameWithoutScope(pkg.name);

  let entryPoints = [];
  if (!inputs) {
    entryPoints = [`${pkgPath}/src/index.ts`];
  } else {
    entryPoints = inputs.split(',').map((input) => `${pkgPath}/${input}`);
  }

  // read more: https://esbuild.github.io/api/#packages
  let externalPackages = {};
  if (!!external) {
    externalPackages = {
      external: external.split(','),
    };
  } else if (!!externalAllExcept) {
    const excludedPackages = externalAllExcept.split(',');
    const dependencies = Object.keys(pkg.dependencies).filter(
      (name) => !excludedPackages.includes(name)
    );

    externalPackages = {
      external: dependencies,
    };
  } else {
    externalPackages = {
      packages: 'external',
    };
  }

  console.log(`[build] Running for ${path}`);

  const typeCheckingTask = $({
    cwd: pkgPath,
    stderr: process.stderr,
    stdout: process.stdout,
  })`tsc --declaration --emitDeclarationOnly -p tsconfig.build.json`;
  const esbuildTask = esbuild.build({
    bundle: true,
    minify: true,
    splitting: !!splitting,
    keepNames: true,
    sourcemap: true,
    platform: 'browser',
    format: 'esm',
    outdir: `${pkgPath}/dist`,
    entryPoints: entryPoints,
    metafile: true,
    plugins: [
      nodeModulesPolyfillPlugin({
        globals: {
          fs: true,
        },
      }),
    ],
    ...externalPackages,
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
