#!/usr/bin/env node
'use strict';
import process from 'node:process';
import { workspacePackages } from '../common/utils.mjs';
import { build } from './build.mjs';

async function run() {  
  const packages = await workspacePackages();
  let packagesToBeBuild = packages.filter((pkg) => !pkg.private);

  console.log('these packages will be built:', packagesToBeBuild.map(pkg=>pkg.name).join(', ')) ;

  console.log(`🔨 Start building...`);
  await build(packagesToBeBuild);
  console.log('🔨 Finish building');
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});