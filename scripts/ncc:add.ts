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
if (!input) handleError(new Error('Please specify a dependency to install and pre-compile.'));

// Parse the specified package information
// and resolve a destination path
const pkg = parse(input);
const destination = path.resolve(__dirname, '..', 'compiled', pkg.name);

if (process.env['ncc:add:SKIP_INSTALL']) {
  // Just compile the dependency (skip install)
  console.log(`Compiling ${getPkgIdentifier()}`);
  ncc(require.resolve(pkg.name), { cache: false, minify: true, quiet: true, target: 'es6' })
    .then(postBuild)
    .catch(handleError);
} else {
  // Install and compile the dependency
  console.log(`Installing ${getPkgIdentifier()}`);
  execa
    .command(`yarn add -D ${getPkgIdentifier()}`)
    .then(() => {
      console.log(`Compiling ${getPkgIdentifier()}`);
      return ncc(require.resolve(pkg.name), { cache: false, minify: true, quiet: true, target: 'es6' });
    })
    .then(postBuild)
    .catch(handleError);
}

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
 * Once the dependency is built using `@vercel/ncc`,
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
  const { name, version, author, license } = require(pkgJsonPath);

  const data = `${JSON.stringify({
    name,
    version,
    main: 'index.js',
    ...(author ? { author } : undefined),
    ...(license ? { license } : undefined),
  })}\n`;

  write(path.join(destination, 'package.json'), data);
}

/**
 * Normalize the package identifier based
 * on whether a version range was provided.
 */
function getPkgIdentifier() {
  return pkg.version ? `${pkg.name}@${pkg.version}` : pkg.name;
}

/**
 * Log the given `err` and exit the process with status code `1`.
 */
function handleError<T extends Error>(err: T) {
  console.error(err);
  process.exit(1);
}
