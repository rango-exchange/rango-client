// Wrapper around lingui command that exits with a non zero value if an error is detected. Lingui commands do not fail with a non-zero exit code in some cases. There is an open issue here: https://github.com/lingui/js-lingui/issues/1419
const { exec } = require('child_process');

const args = process.argv.splice(2);
const command = `yarn lingui ${args.join(' ')}`;

const handleLinguiCommand = function (error, stdout, stderr) {
  if (error) {
    // Handle exec command error (lingui command not found?)
    console.log(`error: ${error}`);
    throw error;
  }
  // Display command standard output
  console.log(`stdout: ${stdout}`);
  // Display command standard error
  console.log(`stderr: ${stderr}`);
  process.exit(!!stderr ? 1 : 0);
};
exec(command, handleLinguiCommand);
