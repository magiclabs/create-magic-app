#!/usr/bin/env ts-node-script

/* eslint-disable no-await-in-loop */

import path from 'path';
import execa from 'execa';
import fs from 'fs';

const destination = path.resolve(__dirname, '..', 'compiled');
const pkgs = fs.readdirSync(destination).filter((dir) => fs.statSync(path.join(destination, dir)).isDirectory());

console.log(`Updating pre-compiled dependencies from current node_modules state...`);

Promise.all(
  pkgs.map(async (pkg) => {
    await execa.command(`yarn ncc:add ${pkg}`, { env: { 'ncc:add:SKIP_INSTALL': 'true' } });
    console.log(`✓ ${pkg}`);
  }),
).catch(handleError);

/**
 * Log the given `err` and exit the process with status code `1`.
 */
function handleError<T extends Error>(err: T) {
  console.error(err);
  process.exit(1);
}
