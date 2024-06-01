import fs from 'fs/promises';
import path from 'path';
import commandLineArgs from 'command-line-args';
import { downloadTargetBranchArtifacts } from './downloadTargetBranchArtifacts.mjs';
import { findBuildJsonFiles } from './findBuildFiles.mjs';
import { compareBuildJsonFiles } from './compare.mjs';

async function run() {
  const optionDefinitions = [
    { name: 'currentBranchDirectory', type: String },
    { name: 'targetBranchDirectory', type: String },
    { name: 'targetBranchArtifactName', type: String },
  ];
  const {
    currentBranchDirectory,
    targetBranchDirectory,
    targetBranchArtifactName,
  } = commandLineArgs(optionDefinitions);

  const githubToken = process.env.GH_TOKEN;
  const repository = process.env.GH_REPOSITORY;

  const targetBranchPath = path.join(process.cwd(), targetBranchDirectory);
  const currentBranchPath = path.join(process.cwd(), currentBranchDirectory);

  try {
    await downloadTargetBranchArtifacts(
      targetBranchDirectory,
      targetBranchArtifactName,
      repository,
      githubToken
    );
    await Promise.all([fs.stat(targetBranchPath), fs.stat(currentBranchPath)]);
  } catch (error) {
    console.log(
      'Directories for the target or current branch do not exist, the bundle size comparison will be skipped.'
    );
    process.exit(0);
  }

  const targetBranchBuilds = await findBuildJsonFiles(targetBranchPath);
  const currentBranchBuilds = await findBuildJsonFiles(currentBranchPath);

  const comparison = await compareBuildJsonFiles(
    targetBranchBuilds,
    currentBranchBuilds
  );
  console.table(comparison);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
