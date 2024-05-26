import fs from 'fs';
import { pipeline } from 'stream/promises';
import { execa } from 'execa';

/**
 * Downloads and extracts artifacts from the specified GitHub repository's actions for the target branch.
 * @param {string} targetBranchDirectory - The directory where the artifacts will be extracted.
 * @param {string} artifactName - The name of the artifact to be downloaded.
 * @param {string} repository - The GitHub repository in the format owner/repo.
 * @param {string} githubToken - The GitHub token for authentication.
 * @returns {Promise<void>} - A Promise that resolves when the artifacts are downloaded and extracted successfully.
 * @throws {Error} - If there's an error during the process.
 */
export async function downloadTargetBranchArtifacts(
  targetBranchDirectory,
  artifactName,
  repository,
  githubToken
) {
  if (!githubToken || !repository || !artifactName) {
    console.error(
      'Missing required parameters (githubToken, repository, artifactName)'
    );
    process.exit(1);
  }
  try {
    // List Artifacts
    const artifactsResponse = await fetch(
      `https://api.github.com/repos/${repository}/actions/artifacts`,
      {
        headers: { Authorization: `token ${githubToken}` },
      }
    );

    if (!artifactsResponse.ok) {
      throw new Error(
        `Failed to fetch artifacts: ${artifactsResponse.statusText}`
      );
    }

    const artifactsData = await artifactsResponse.json();
    const artifacts = artifactsData.artifacts;

    // Find the artifact with the specified name
    const targetArtifact = artifacts.find(
      (artifact) => artifact.name === artifactName
    );

    if (!targetArtifact) {
      console.error('Target Branch Artifact not found');
      return;
    }

    // Extract Target Branch Artifact Download URL
    const artifactUrl = targetArtifact.archive_download_url;
    if (!artifactUrl) {
      console.error('Target Branch Artifact URL not found');
      return;
    }

    // Download Target Branch Artifact
    const downloadResponse = await fetch(artifactUrl, {
      headers: { Authorization: `token ${githubToken}` },
    });

    if (!downloadResponse.ok) {
      throw new Error(
        `Failed to download artifact: ${downloadResponse.statusText}`
      );
    }

    // Save the artifact zip file
    const artifactZipPath = 'artifact.zip';
    await pipeline(
      downloadResponse.body,
      fs.createWriteStream(artifactZipPath)
    );

    // Unzip the artifact
    await execa('unzip', [artifactZipPath, '-d', `./${targetBranchDirectory}`]);

    console.log('Artifact downloaded and extracted successfully.');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}
