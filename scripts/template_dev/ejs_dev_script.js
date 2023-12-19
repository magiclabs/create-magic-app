const { execSync, exec } = require('child_process');
const watch = require('watch');
let fs = require('fs-extra');
const { setupTsconfig, convertCommandToString, readTemplateDirs } = require('./utils');
const path = require('path');

setupTsconfig();
const { templateDevData } = require('../../scaffolds/dev-data');

let nextProcess = null;

const template = process.argv[2];

if (!template) {
  console.log('Please specify a template to use');
  process.exit(1);
}

const ejsData = templateDevData[template];

const scaffoldInstance = new (require(`../../scaffolds/${template}/scaffold.ts`).default)();

console.log('Rebuilding template...');
fs.rmSync('./.template-dev', { recursive: true, force: true });

fs.cpSync(`./scaffolds/${template}/template`, './.template-dev', { recursive: true });

process.chdir('./.template-dev');

console.log('Building EJS files...');
readTemplateDirs(path.resolve(`./`), (err, filePaths) => {
  if (err) {
    console.log(err);
  }

  filePaths.forEach((filePath) => {
    if (!filePath.includes('/public/') && !filePath.includes('/.next/')) {
      const result = execSync(
        `ejs .${filePath.replace(process.cwd(), '')} -i ${encodeURI(JSON.stringify(ejsData))} -o .${filePath.replace(
          process.cwd(),
          '',
        )}`,
      );
    }
  });

  if (fs.existsSync('./.env.example')) {
    fs.renameSync('./.env.example', './.env');
  }

  console.log('Installing dependencies...');
  execSync(convertCommandToString(scaffoldInstance.installationCommand), { stdio: 'inherit' });

  console.log('Running dev server...');
  nextProcess = exec(convertCommandToString(scaffoldInstance.startCommand), { stdio: 'inherit' });
  nextProcess.stdout.on('data', function (data) {
    console.log(data);
  });
  console.log('Running dev server with process ID: ', nextProcess.pid);

  watch.createMonitor(`../scaffolds/${template}`, function (monitor) {
    console.log('Watching for changes in template files...');
    monitor.on('created', function (f, stat) {
      console.log('Created:', f);
      fs.copyFileSync(f, `./${f.split('template')[1]}`);
    });
    monitor.on('changed', function (f, curr, prev) {
      console.log('Changed:', f);
      fs.copyFileSync(f, `./${f.split('template')[1]}`);
    });
    monitor.on('removed', function (f, stat) {
      console.log('Removed:', f);
      fs.rmSync(`./${f.split('template')[1]}`, { recursive: true, force: true });
    });
  });

  process.on('beforeExit', () => {
    console.log('Killing dev server...');
    nextProcess.kill();
    process.exit();
  });

  process.on('SIGTERM', () => {
    console.log('Killing dev server...');
    nextProcess.kill();
    process.exit();
  });

  process.on('SIGINT', () => {
    console.log('Killing dev server...');
    nextProcess.kill();
    process.exit();
  });
});
