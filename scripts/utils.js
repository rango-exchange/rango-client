const chalk = require('chalk');

/**
    Extract command and data from a specific format (`[command]data`)

    @param {string} str - The input string that needs to be parsed for commands
*/
function parseCommand(str) {
  // trim whitespace from both ends of the string and convert to lower case
  const input = str.trim().toLowerCase();
  // regex to match parts in the middle between square brackets
  const regex = /\[(.*)\](.*)/g;
  // retrieve command name and associated data by matching regex against input
  const [, command, data] = Array.from(input.matchAll(regex))[0];
  // set of valid command names that should be accepted
  const validCommands = new Set(['build']);
  // check if command is valid, otherwise return empty array
  if (!validCommands.has(command)) {
    return [];
  }

  // return command and data as a two element array
  return [command, data];
}

function awake() {
  process.stdin.resume();
  process.on('SIGINT', () => {
    console.log('Received SIGINT. Press Control-D to exit.');
    process.stdin.pause();
  });
}

function headStyle(section, sub = '', color = 'bgBlue') {
  sub = sub && `/${sub}`;
  return chalk[color](`[${chalk.bold(section)}${sub}]\n`);
}

module.exports = {
  parseCommand,
  awake,
  headStyle,
};
