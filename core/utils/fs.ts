import { RenderFileCallback, renderFile } from 'ejs';
import fs from 'fs';
import fse from 'fs-extra';

export const copyFile = (from: string, to: string, data: any) => {
  renderFile(from, data, {}, (err, str) => {
    if (err) {
      console.error(err);
    } else {
      if (err) console.log(err);
      fse.outputFileSync(to, str);
    }
  });
};

export const copyDirectory = (source: string, basePath: string, data: any) => {
  readTemplateDirs(source, (err, filePaths) => {
    if (err) console.log(err);
    for (const filePath of filePaths) {
      copyFile(filePath, `${process.cwd()}${filePath.replace(basePath, '')}`, data);
    }
  });
};

const readTemplateDirs = (
  root: string,
  done: (err: NodeJS.ErrnoException | null, results: string[]) => void,
): string[] => {
  var filePaths: string[] = [];
  fs.readdir(root, (err, files) => {
    if (err) {
      console.log(err);
      return;
    }
    var pending = files.length;
    if (!pending) return done(null, filePaths);
    files.forEach((file) => {
      const stats = fs.statSync(`${root}/${file}`);
      if (stats && stats.isDirectory()) {
        readTemplateDirs(`${root}/${file}`, (err, res) => {
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
