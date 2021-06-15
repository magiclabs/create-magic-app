#!/usr/bin/env ts-node-script

/* eslint-disable no-await-in-loop */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */

import path from 'path';
import fs from 'fs';
import ncc from '@vercel/ncc';
import parse from 'parse-package-name';
import bytes from 'bytes';

console.log();
console.log(`Pre-compiling dependencies...`);
console.log();

const baseDir = path.resolve(__dirname, '..', 'compiled');

// Cleanup current state of `compiled/*` directory...
const cleanups = fs.readdirSync(baseDir).filter((i) => fs.statSync(path.join(baseDir, i)).isDirectory());
for (const dir of cleanups) {
  fs.rmdirSync(path.join(baseDir, dir), { recursive: true });
}

// Pre-compile certain node_modules defined in `compiled/config.json`
const pkgs = JSON.parse(fs.readFileSync(path.join(baseDir, 'config.json')).toString());
Promise.all<number>(
  pkgs.map(async (pkg) => {
    await precompileDependency(pkg);
    const footprint = await getDirectorySize(path.join(baseDir, pkg));
    console.log(`✓ ${pkg} (${bytes(footprint)})`);
    return footprint;
  }),
)
  .then((result) => {
    console.log();
    console.log(`Total footprint: ${bytes(result.reduce((acc, next) => acc + next, 0))}`);
    console.log();
  })
  .catch(handleError);

/**
 * Get the size of a directory's contents, recursively.
 */
async function getDirectorySize(dir: string): Promise<number> {
  const listing = (await fs.promises.readdir(dir)).map((i) => path.join(dir, i));

  return listing.reduce(async (acc, curr) => {
    if (fs.statSync(curr).isDirectory()) {
      return Promise.resolve((await acc) + (await getDirectorySize(curr)));
    }

    const { size } = fs.statSync(curr);
    return Promise.resolve((await acc) + size);
  }, Promise.resolve(0));
}

/**
 * Pre-compile a node_module dependnecy using `@vercel/ncc`.
 */
async function precompileDependency(input: string) {
  // Parse the specified package information
  // and resolve a destination path
  const pkg = parse(input);
  const destination = path.join(baseDir, pkg.name);

  /**
   * Write a file with the given data to `[root]/compiled/[pkg.name]`.
   */
  const write = (file: string, data: any) => {
    if (file && data) {
      fs.writeFileSync(file, data, { encoding: 'utf-8' });
    }
  };

  /**
   * Once the dependency is built using `@vercel/ncc`,
   * write the output to `[root]/compiled/[pkg.name]`.
   */
  const postBuild = ({ code }) => {
    if (!fs.existsSync(destination)) {
      fs.mkdirSync(destination, { recursive: true });
    }

    write(path.join(destination, 'index.js'), code);
    writeLicense();
    writePackageJson();
  };

  /**
   * Write a LICENSE file for the dependency currently being compiled.
   */
  const writeLicense = () => {
    const pkgJsonPath = require.resolve(`${pkg.name}/package.json`);
    const licensePath = [
      path.join(path.dirname(pkgJsonPath), './LICENSE'),
      path.join(path.dirname(pkgJsonPath), './LICENSE.md'),
      path.join(path.dirname(pkgJsonPath), './LICENSE.txt'),
      path.join(path.dirname(pkgJsonPath), './license'),
      path.join(path.dirname(pkgJsonPath), './license.md'),
      path.join(path.dirname(pkgJsonPath), './license.txt'),
    ].find((file) => fs.existsSync(file));

    if (licensePath) {
      write(path.join(destination, 'LICENSE'), fs.readFileSync(licensePath));
    }
  };

  /**
   * Get the `package.json` file for the dependency currently being compiled.
   */
  const getPackageJson = () => {
    const pkgJsonPath = path.join(__dirname, '../node_modules', pkg.name, 'package.json');
    return JSON.parse(fs.readFileSync(pkgJsonPath).toString());
  };

  /**
   * Write a minimal `package.json` file for the dependency currently being compiled.
   */
  const writePackageJson = () => {
    const { name, version, author, license } = getPackageJson();

    const data = `${JSON.stringify({
      name,
      version,
      main: 'index.js',
      ...(author ? { author } : undefined),
      ...(license ? { license } : undefined),
    })}\n`;

    write(path.join(destination, 'package.json'), data);
  };

  const externals = getPackageJson().peerDependencies ?? [];
  return ncc(require.resolve(pkg.name), { cache: false, minify: true, quiet: true, target: 'es6', externals })
    .then(postBuild)
    .catch(handleError);
}

/**
 * Log the given `err` and exit the process with status code `1`.
 */
function handleError<T extends Error>(err: T) {
  console.error(err);
  process.exit(1);
}
