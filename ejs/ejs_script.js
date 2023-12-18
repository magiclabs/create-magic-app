const { execSync, exec } = require('child_process');
const watch = require('watch');
let fs = require('fs-extra');
const { setupTsconfig, convertCommandToString } = require('./utils');

setupTsconfig();

let nextProcess = null;

const template = process.argv[2];

const EJS_DATA_FILE = '../ejs/ejs_data.json';
const ejsSourceFiles = [
  { inputFile: './package.json', outputFile: './package.json' },
  { inputFile: './.env.example', outputFile: './.env' },
  { inputFile: './src/components/magic/Login.tsx', outputFile: './src/components/magic/Login.tsx' },
  {
    inputFile: './src/components/magic/cards/WalletMethodsCard.tsx',
    outputFile: './src/components/magic/cards/WalletMethodsCard.tsx',
  },
];
const scaffoldInstance = new (require(`../scaffolds/${template}/scaffold.ts`).default)();

console.log('Rebuilding template...');
fs.rmSync('./test', { recursive: true, force: true });

fs.cpSync(`./scaffolds/${template}/template`, './test', { recursive: true });

process.chdir('./test');

if (!fs.existsSync('./node_modules')) {
  console.log('Current directory: ', process.cwd());

  console.log('Installing dependencies...');
  execSync(convertCommandToString(scaffoldInstance.installationCommand), { stdio: 'inherit' });
}

ejsSourceFiles.forEach(({ inputFile, outputFile }) => {
  const result = execSync(`ejs ${inputFile} -f ${EJS_DATA_FILE} -o ${outputFile}`);
  console.log('Template compiled:', inputFile);
});

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
