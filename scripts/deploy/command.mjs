#!/usr/bin/env node
'use strict';
import process from 'node:process';
import { workspacePackages } from '../common/utils.mjs';
import { build } from '../publish/build.mjs';
import { logAsSection } from '../publish/utils.mjs';
import { deployProjectsToVercel } from './utils.mjs';

const EXCLUDED_PACKAGES = ['@rango-dev/widget-iframe'];

// TODO: Working directory should be empty.
async function run() {
  // Detect last release and what packages has changed since then.
  const packages = await workspacePackages();
  const privatePackages = packages.filter((pkg) => {
    if (EXCLUDED_PACKAGES.includes(pkg.name)) return false;
    return pkg.private;
  });

  await build(privatePackages).catch((e) => {
    console.log(
      '[-] BUILD FAILED. Ignore it to workflow run the rest of tasks.'
    );
    throw e;
  });
  logAsSection('[x] Build for VERCEL');
  await deployProjectsToVercel(privatePackages).catch((e) => {
    console.log(
      '[-] DEPLOY FAILED. Ignore it to workflow run the rest of tasks.'
    );
    throw e;
  });
  logAsSection('[x] Deploy to VERCEL');
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
