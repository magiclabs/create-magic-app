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

const readTemplateDirs = (root, done) => {
  let filePaths = [];
  fs.readdir(root, (err, files) => {
    if (err) {
      console.log(err);
      return;
    }
    let pending = files.length;
    if (!pending) return done(null, filePaths);
    files.forEach((file) => {
      const stats = fs.statSync(`${root}/${file}`);
      if (stats && stats.isDirectory()) {
        readTemplateDirs(`${root}/${file}`, async (error, res) => {
          filePaths = filePaths.concat(res);
          if (!--pending) done(null, filePaths);
        });
      } else {
        filePaths.push(`${root}/${file}`);
        if (!--pending) done(null, filePaths);
      }
    });
  });
  return filePaths;
};

module.exports = {
  setupTsconfig,
  convertCommandToString,
  readTemplateDirs,
};
