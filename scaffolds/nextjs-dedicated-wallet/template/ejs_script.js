const { execSync, exec } = require('child_process');
const fs = require('fs');

const EJS_DATA_FILE = './ejs_data.json';
const ejsSourceFiles = [
  { inputFile: 'package.json', outputFile: 'package.json' },
  { inputFile: './.env.example', outputFile: './.env.example' },
  { inputFile: './src/components/magic/Login.tsx', outputFile: './src/components/magic/Login.tsx' },
  {
    inputFile: './src/components/magic/cards/WalletMethodsCard.tsx',
    outputFile: './src/components/magic/cards/WalletMethodsCard.tsx',
  },
];

if (fs.existsSync('../../../test')) {
  console.log('Deleting previous test build...');
  fs.rmSync('../../../test', { recursive: true, force: true });
}

console.log('Creating test build...');
fs.cpSync('./', '../../../test', { recursive: true });
process.chdir('../../../test');
console.log('Current directory: ', process.cwd());
ejsSourceFiles.forEach(({ inputFile, outputFile }) => {
  const result = execSync(`ejs ${inputFile} -f ${EJS_DATA_FILE} -o ${outputFile}`);
  console.log('Template compiled:', inputFile);
});

console.log('Installing dependencies...');
execSync('npm install', { stdio: 'inherit' });

console.log('Running dev server...');
execSync('npm run dev', { stdio: 'inherit' });
