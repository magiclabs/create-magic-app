import fs from 'fs';
import { renderFile } from 'ejs';
import fse from 'fs-extra';
import chalk from 'chalk';
import { createPromise } from 'core/utils/create-promise';
import { isBinary } from './is-binary';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Confirm } = require('enquirer');

// TODO - rename so that we know it also renders ejs
export const copyFileWithEjsData = async (from: string, to: string, data: any) => {
  await createPromise<void>(async (resolve, reject) => {
    const buffer = await fse.readFile(from);
    const shouldRenderEjs = !isBinary(from, buffer);

    if (shouldRenderEjs) {
      await renderFile(from, data || {}, async (err, str) => {
        if (err) {
          reject(err);
        } else {
          try {
            await outputFile(to, str).then(resolve).catch(reject);
          } catch (error) {
            reject(error);
          }
        }
      });
    } else {
      try {
        await outputFile(to, buffer).then(resolve).catch(reject);
      } catch (err) {
        reject(err);
      }
    }
  });
};

async function outputFile(to: string, data: any) {
  if (await shouldOverwriteFile(to)) {
    await fse.outputFile(to, data);
  }
}

export const readTemplateDirs = (
  root: string,
  done: (err: NodeJS.ErrnoException | null, results: string[]) => void,
): string[] => {
  let filePaths: string[] = [];
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

const shouldOverwriteFile = async (filePath: string): Promise<boolean> => {
  const exists = await fse.pathExists(filePath);
  if (exists) {
    const overwrite = await new Confirm({
      name: 'overwrite',
      message: `Conflict on \`${filePath.split('/').pop()}\` ${chalk.red('\n  Overwrite?')}`,
      initial: false,
    }).run();

    return overwrite;
  }
  return true;
};
