#!/usr/bin/env node
'use strict';
import process from 'node:process';
import { logAsSection } from '../publish/utils.mjs';
import { getDeployableClients } from './utils.mjs';
import { ciBuild } from '../build-libs/ciBuild.mjs';
import commandLineArgs from 'command-line-args';

async function run() {
  const optionDefinitions = [{ name: 'prebuild-libs', type: Boolean }];

  const { 'prebuild-libs': prebuildLibs } = commandLineArgs(optionDefinitions);
  const listPackagesToBeBuilt = await getDeployableClients();

  logAsSection('[x] Build deployable packages');
  await ciBuild(listPackagesToBeBuilt, prebuildLibs).catch((e) => {
    console.log(
      '[-] BUILD FAILED. Ignore it to workflow run the rest of tasks.'
    );
    throw e;
  });
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
