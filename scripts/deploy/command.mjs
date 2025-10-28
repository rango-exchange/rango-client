#!/usr/bin/env node
'use strict';
import process from 'node:process';
import { logAsSection } from '../publish/utils.mjs';
import {
  deployProjectsToVercel,
  getClientsListToBeDeployed,
} from './utils.mjs';

// TODO: Working directory should be empty.
async function run() {
  const listPackagesToBeDeployed = await getClientsListToBeDeployed();
  logAsSection('[x] Build for VERCEL');
  await deployProjectsToVercel(listPackagesToBeDeployed).catch((e) => {
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
