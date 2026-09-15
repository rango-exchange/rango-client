import chalk from 'chalk';

export function logAsSection(title, sub = '') {
  let message = chalk.bgBlue.white.bold(title);
  if (!!sub) {
    message += ' ';
    message += sub;
  }
  console.log(message);
}
