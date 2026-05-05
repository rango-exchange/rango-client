import { createHash } from 'node:crypto';
import { exec as execCallback } from 'node:child_process';
import { promisify } from 'node:util';

const execCallbackAsync = promisify(execCallback);

function getWorkspaceKeysHash(stringifiedWorkspaceInfo) {
  let workspaceInfo;
  try {
    workspaceInfo = JSON.parse(stringifiedWorkspaceInfo);
  } catch (error) {
    throw new Error(
      'Unable to parse output from yarn workspaces -s info --json',
      { cause: stringifiedWorkspaceInfo }
    );
  }
  const workspaceKeys = Object.keys(workspaceInfo).sort().join('|');

  return createHash('sha256').update(workspaceKeys).digest('hex');
}

async function run() {
  const { stdout, error, stderr } = await execCallbackAsync(
    'yarn workspaces -s info --json'
  );

  if (error) {
    throw error;
  }

  if (stderr) {
    throw new Error(stderr);
  }

  const hash = getWorkspaceKeysHash(stdout);
  process.stdout.write(hash);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
