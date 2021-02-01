#!/usr/bin/env ts-node-script

import path from 'path';
import parse from 'parse-package-name';
import execa from 'execa';
import fs from 'fs';

// Parse command input
const [input] = process.argv.slice(2);
if (!input) handleError(new Error('Please specify a pre-compiled dependency to remove.'));

// Parse the specified package information
// and resolve a destination path
const pkg = parse(input);
const destination = path.resolve(__dirname, '..', 'compiled', pkg.name);

if (fs.existsSync(destination)) {
  deleteFolderRecursive(destination);
  execa.command(`yarn remove ${pkg.name}`).catch(handleError);
} else {
  handleError(
    new Error(
      `${pkg.name} is not managed as a pre-compiled dependency. You can remove it with \`yarn remove ${pkg.name}\``,
    ),
  );
}

/**
 * Remove the given non-empty `dir`.
 */
function deleteFolderRecursive(dir: string) {
  fs.readdirSync(dir).forEach((file) => {
    const currPath = `${dir}/${file}`;
    if (fs.lstatSync(currPath).isDirectory()) {
      deleteFolderRecursive(currPath);
    } else {
      fs.unlinkSync(currPath);
    }
  });
  fs.rmdirSync(dir);
}

/**
 * Log the given `err` and exit the process with status code `1`.
 */
function handleError<T extends Error>(err: T) {
  console.error(err);
  process.exit(1);
}
