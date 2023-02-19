#!/usr/bin/env node
'use strict';

import { execa } from 'execa';
import { join } from 'node:path';
import {
  buildPackages,
  changed,
  increaseVersionForNext,
  printDirname,
  pushToRemote,
  tagPackages,
} from './utils.mjs';

const root = join(printDirname(), '..');
const nx = join(root, 'node_modules', '.bin', 'nx');

async function run() {
  const baseCommit = await getLastTagHashId();
  const changedPkgs = await changed(baseCommit);
  console.log({ baseCommit, changedPkgs });

  if (changedPkgs.length === 0) {
    throw new Error(`There is no changed package since ${baseCommit}`);
  }

  // TODO: Working directory should be empty.

  const channel = detectChannel();
  if (channel === 'next') {
    const updatedPackages = await increaseVersionForNext(changedPkgs);
    console.log({ updatedPackages });
    const taggedPackages = await tagPackages(updatedPackages);
    console.log({ taggedPackages });
    await pushToRemote('next');
    await buildPackages(changedPkgs);
    console.log('Build has been finished...');
    await publishPackages(changedPkgs);
    return;
  } else {
    throw new Error('Channel not detected');
  }
}

run();

/* -------------------------------- */

function publishNext() {}

function detectChannel() {
  // TODO: support for production
  return 'next';
}

async function getAffectedProjects(base = 'HEAD') {
  const { stdout: result } = await execa(nx, ['print-affected', '--base', base]);

  if (!result) {
    throw new Error('There is no affected changes since the last release.');
  }
  // const result = execa(`nx print-affected --base=${base}`).toString();
  // structure: tasks[], projects[], projectGraph[]
  const data = JSON.parse(result);

  return data.projects;
}

// TODO: Check for when there is no tag.
async function getLastTagHashId() {
  const { stdout: hash } = await execa('git', ['rev-list', '--max-count', 1, '--tags']);
  return hash;
}
