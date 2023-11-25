#!/usr/bin/env node

'use strict';
import { join } from 'node:path';
import commandLineArgs from 'command-line-args';
import { watch } from './watch.mjs';
import { awake } from '../dev-watch/utils.mjs';
import { printDirname } from '../common/utils.mjs';

const cwd = join(printDirname(), '..', '..');
const nx = join(cwd, 'node_modules', '.bin', 'nx');

async function run() {
  const optionDefinitions = [{ name: 'project', type: String }];
  const { project } = commandLineArgs(optionDefinitions);

  awake();
  watch({ project, nx, cwd });
}

run();
