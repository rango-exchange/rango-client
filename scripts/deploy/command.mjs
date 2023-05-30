#!/usr/bin/env node
'use strict';
import process from 'node:process';
import { workspacePackages } from '../common/utils.mjs';
import { buildPackages, logAsSection } from '../publish/utils.mjs';
import { deployProjectsToVercel } from './utils.mjs';

// TODO: Working directory should be empty.
async function run() {
  // Detect last relase and what packages has changed since then.
  const packages = await workspacePackages();
  const privatePackages = packages.filter((pkg) => {
    return pkg.private;
  });

  await buildPackages(privatePackages).catch((e) => {
    console.log(
      '[-] BUILD FAILED. Ignore it to workflow run the rest of tasks.'
    );
    console.log(e);
  });
  logAsSection('[x] Build for VERCEL');
  await deployProjectsToVercel(privatePackages).catch((e) => {
    console.log(
      '[-] DEPLOY FAILED. Ignore it to workflow run the rest of tasks.'
    );
    console.log(e);
  });
  logAsSection('[x] Deploy to VERCEL');
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
