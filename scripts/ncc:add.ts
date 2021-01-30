#!/usr/bin/env ts-node-script

/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */

import path from 'path';
import ncc from '@vercel/ncc';
import parse from 'parse-package-name';
import execa from 'execa';
import fs from 'fs';
import bytes from 'bytes';

// Parse command input
const [input] = process.argv.slice(2);
if (!input) handleError(new Error('Please specify a dependency to install and compile.'));

// Parse the specified package information
// and resolve some important paths
const pkg = parse(input);
const destination = path.resolve(__dirname, '..', 'compiled', pkg.name);

// Install and compile the specified dependency
console.log(`Installing ${pkg.name}@${pkg.version}`);
execa
  .command(`yarn add -D ${pkg.name}@${pkg.version}`)
  .then(() => {
    console.log(`Compiling ${pkg.name}@${pkg.version}`);
    return ncc(require.resolve(pkg.name), { cache: false, minify: true, quiet: true, target: 'es6' });
  })
  .then(postBuild)
  .catch(handleError);

/**
 * Write a file with the given data to `[root]/compiled/[pkg.name]`.
 */
function write(file: string, data: any) {
  if (file && data) {
    fs.writeFileSync(file, data, { encoding: 'utf-8' });
    console.log(`✓ ${path.relative(destination, file)} (${bytes(fs.statSync(file).size)})`);
  }
}

/**
 * Once the dependency is build using `@vercel/ncc`,
 * write the output to `[root]/compiled/[pkg.name]`.
 */
function postBuild({ code }) {
  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination, { recursive: true });
  }

  write(path.join(destination, 'index.js'), code);
  writeLicense();
  writePackageJson();
}

/**
 * Write a LICENSE file for the dependency.
 */
function writeLicense() {
  const pkgJsonPath = require.resolve(`${pkg.name}/package.json`);
  const licensePath = [
    path.join(path.dirname(pkgJsonPath), './LICENSE'),
    path.join(path.dirname(pkgJsonPath), './license'),
  ].find((file) => fs.existsSync(file));

  if (licensePath) {
    write(path.join(destination, 'LICENSE'), fs.readFileSync(licensePath));
  }
}

/**
 * Write a minimal `package.json` file for the dependency.
 */
function writePackageJson() {
  const pkgJsonPath = require.resolve(`${pkg.name}/package.json`);
  const { name, author, license } = require(pkgJsonPath);

  const data = `${JSON.stringify({
    name,
    main: 'index.js',
    ...(author ? { author } : undefined),
    ...(license ? { license } : undefined),
  })}\n`;

  write(path.join(destination, 'package.json'), data);
}

/**
 * Log the given `err` and exit the process.
 */
function handleError<T extends Error>(err: T) {
  console.error(err);
  process.exit(1);
}
