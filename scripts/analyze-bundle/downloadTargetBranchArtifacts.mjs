import fs from 'fs';
import { pipeline } from 'stream/promises';
import { execa } from 'execa';

export async function downloadTargetBranchArtifacts(
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
    await execa('unzip', [artifactZipPath, '-d', './target-branch']);

    console.log('Artifact downloaded and extracted successfully.');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}
