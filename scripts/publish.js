#!/usr/bin/env node
const { exec, execSync } = require('node:child_process');

/*
    1. Detect base branch
    2. Detect affected projects and print them
    3. Increase affected packages version
    4. Build affected packages
    5. publish to npm
*/

function isNext() {
  console.log('REF', process.env.REF);
  console.log('BASE_REF', process.env.BASE_REF);
  return process.env.REF === 'refs/heads/next' || process.env.BASE_REF == 'next';
}

function getLastTagHashId() {
  const output = execSync('git rev-list --max-count=1 --tags').toString();
  return output.trim();
}

function getAffectedProjects(base) {
  const result = execSync(`nx print-affected --base=${base}`).toString();
  // structure: tasks[], projects[], projectGraph[]
  const data = JSON.parse(result);

  return data.projects;
}

function run() {
  let baseBranch = 'main';
  let versionCommand = 'npx lerna version --conventional-graduate --yes';
  if (isNext()) {
    versionCommand = 'npx lerna version --conventional-prerelease --no-changelog --yes';
    baseBranch = 'next';
  }

  console.log('VERSION', versionCommand);

  const baseCommit = getLastTagHashId() || baseBranch;
  console.log('baseCommit:', baseCommit);
  const affectedProjects = getAffectedProjects(baseCommit);

  console.log('affectedProjects: ', affectedProjects.length);
  console.log(affectedProjects.join(','));
}

run();
