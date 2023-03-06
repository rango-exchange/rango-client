import process from 'node:process';
import { exec } from 'node:child_process';
import { headStyle } from '../utils.mjs';

export function dev(params) {
  const { project, nx, cwd } = params;
  const command = `${nx} run-many --target=dev --projects=${project}`;
  console.log(headStyle('main'), `Running dev command \n\n`);

  const dev = exec(command, { cwd }, (err, stdout, stderr) => {
    if (err) {
      console.log(headStyle('dev', 'error', 'bgRed'), stderr);
      process.exit(1);
    }
    console.log(headStyle('dev'), stdout);
  });

  dev.stdout.on('data', d => {
    console.log(headStyle('dev'), d);
  });
}
