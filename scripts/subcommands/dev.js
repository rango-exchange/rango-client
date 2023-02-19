const process = require('node:process');
const { exec } = require('node:child_process');
const { headStyle } = require('../utils');

function dev(params) {
  const { project, nx, cwd } = params;
  const command = `${nx} run-many --target=dev --projects=${project}`;
  console.log(headStyle('main'), `Running dev command \n\n`);

  const dev = exec(command, { cwd }, (err, stdout, stderr) => {
    if (err) {
      console.log(headStyle('dev', 'error', 'bgRed'), stderr);
      process.exit(0);
    }
    console.log(headStyle('dev'), stdout);
  });

  dev.stdout.on('data', (d) => {
    console.log(headStyle('dev'), d);
  });
}

module.exports = {
  dev,
};
