const tsNode = require('ts-node');
let json = require('json5');
let fs = require('fs-extra');

//setting up tsconfig for ts-node to compile the scaffold.ts file of any scaffold
const setupTsconfig = () => {
  let tsconfig = {
    compilerOptions: {
      ...json.parse(fs.readFileSync(`./tsconfig.json`)).compilerOptions,
    },
    transpileOnly: true,
  };

  tsNode.register(tsconfig);
};

const convertCommandToString = (command) => {
  return command.command.concat(' ', command.args.join(' '));
};

module.exports = {
  setupTsconfig,
  convertCommandToString,
};
