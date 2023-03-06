#!/usr/bin/env node

'use strict';
import { join } from 'node:path';
import commandLineArgs from 'command-line-args';
import { dev } from './subcommands/dev.mjs';
import { watch } from './subcommands/watch.mjs';
import { awake } from './utils.mjs';
import { printDirname } from '../common/utils.mjs';

const cwd = join(printDirname(), '..', '..');
const nx = join(cwd, 'node_modules', '.bin', 'nx');

async function run() {
  const optionDefinitions = [{ name: 'project', type: String }];
  const { project } = commandLineArgs(optionDefinitions);

  awake();
  dev({ project, nx, cwd });
  watch({ project, nx, cwd });
}

run();
