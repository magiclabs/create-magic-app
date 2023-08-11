#!/usr/bin/env ts-node-script

/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/prefer-regexp-exec */

import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import Terser from 'terser';

const readFilePromise = promisify(fs.readFile);
const writeFilePromise = promisify(fs.writeFile);

/**
 * Gets all JavaScript file paths from `dir` recursively.
 */
function getAllFiles(dir: string, recursionState: string[] = []) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    if (fs.statSync(`${dir}/${file}`).isDirectory()) {
      recursionState = getAllFiles(`${dir}/${file}`, recursionState);
    } else {
      recursionState.push(path.join(__dirname, '..', dir, '/', file));
    }
  });

  return recursionState.filter((filePath) => filePath.match(/\.js$/));
}

/**
 * Minify all the files given by `filePaths`.
 */
async function minifyFiles(filePaths: string[]) {
  await Promise.all([
    filePaths.map(async (filePath) => {
      const { code } = await Terser.minify(await readFilePromise(filePath, 'utf8'), { compress: true });
      return writeFilePromise(filePath, code);
    }),
  ]);
}

console.log('Optimizing dist files...');
const files = getAllFiles('./dist');
minifyFiles(files);
