#!/usr/bin/env node
'use strict';
import process from 'node:process';
import { logAsSection } from '../publish/utils.mjs';
import { getDeployableClients } from './utils.mjs';
import { build } from '../build-libs/build.mjs';
import commandLineArgs from 'command-line-args';

async function run() {
  const optionDefinitions = [{ name: 'focus', type: Boolean }];

  const { focus } = commandLineArgs(optionDefinitions);
  const listPackagesToBeBuilt = await getDeployableClients();

  logAsSection('[x] Build deployable packages');
  await build(listPackagesToBeBuilt, focus).catch((e) => {
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
