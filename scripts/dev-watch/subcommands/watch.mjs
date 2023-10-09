import { exec } from 'node:child_process';
import process from 'node:process';
import OS from 'os';
import { parseCommand, headStyle } from '../utils.mjs';

export function watch(params) {
  const { project, nx, cwd } = params;
  const isWindowsOS = OS.platform() === 'win32';
  const command = `${nx} watch --projects=${project} --includeDependentProjects -- echo "[build]${
    isWindowsOS ? '%' : '\\$'
  }NX_PROJECT_NAME${isWindowsOS ? '%' : ''}"`;
  console.log(headStyle('main'), `Running watch command\n\n`);

  const watcher = exec(command, { cwd }, (err, stdout, stderr) => {
    if (err) {
      console.log(headStyle('watch', 'error', 'bgRed'), stderr);
      process.exit(1);
    }
    console.log(headStyle('watch'), stdout);
  });
  watcher.stdout.on('data', (d) => {
    console.log(d);
    const [command, data] = parseCommand(d);
    if (command === 'build' && data != project) {
      const build_command = `${nx} run ${data}:build`;
      const build = exec(build_command, (err, result, stderr) => {
        if (err) {
          console.log(headStyle('watch', 'build/error', 'bgRed'), stderr);
          return;
        }
        console.log(headStyle('watch', 'build'), result);
      });

      build.stdout.on('data', (da) => {
        console.log(headStyle('watch', 'build'), da);
      });
    }

    console.log(headStyle('watch'), d);
  });
}
