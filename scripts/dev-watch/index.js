#!/usr/bin/env node

'use strict';
const { join } = require('node:path');
const commandLineArgs = require('command-line-args');
const { dev } = require('./subcommands/dev');
const { watch } = require('./subcommands/watch');
const { awake } = require('./utils');

const cwd = join(__dirname, '..', '..');
const nx = join(cwd, 'node_modules', '.bin', 'nx');

async function run() {
  const optionDefinitions = [{ name: 'project', type: String }];
  const { project } = commandLineArgs(optionDefinitions);

  awake();
  dev({ project, nx, cwd });
  watch({ project, nx, cwd });
}

run();
