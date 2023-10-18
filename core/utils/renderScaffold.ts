import path from 'path';
import fs from 'fs';
import BaseScaffold from 'core/types/BaseScaffold';
import { resolveToRoot } from './path-helpers';
import { copyFileWithEjsData, readTemplateDirs } from './fs';

// TODO - update templateData type to be more specific
export const renderScaffold = async (cwd: string, scaffold: BaseScaffold, templateData: any) => {
  const basePath = resolveToRoot('scaffolds', scaffold.templateName, 'template');
  const allDirFilePaths: string[] = [];
  // typeof scaffold.source being a string means it's a directory and we should copy all files
  if (typeof scaffold.source === 'string') {
    readTemplateDirs(basePath, async (err, filePaths) => {
      if (err) {
        console.log(err);
      }
      for (const filePath of filePaths) {
        allDirFilePaths.push(filePath);
      }
      await copyFilesAndRenameEnv(allDirFilePaths, basePath, cwd, templateData);
    });
    // Otherwise it's an array and we should copy all the files in the array
  } else {
    for (const filePath of scaffold.source) {
      const resolvedPath = resolveToRoot('scaffolds', scaffold.templateName, 'template', filePath);

      const isDirectory = fs.statSync(resolvedPath).isDirectory();
      if (isDirectory) {
        readTemplateDirs(resolvedPath, (err, filePaths) => {
          if (err) {
            console.log(err);
          }
          for (const sourceFilePath of filePaths) {
            allDirFilePaths.push(sourceFilePath);
          }
        });
      } else {
        allDirFilePaths.push(resolvedPath);
      }
    }
    await copyFilesAndRenameEnv(allDirFilePaths, basePath, cwd, templateData);
  }
};

async function copyFilesAndRenameEnv(allDirFilePaths: string[], basePath: string, cwd: string, templateData: any) {
  for (const filePath of allDirFilePaths) {
    await copyFileWithEjsData(filePath, path.join(cwd, filePath.replace(basePath, '')), templateData);
  }
  if (fs.existsSync(path.join(cwd, '.env.example'))) {
    fs.renameSync(path.join(cwd, '.env.example'), path.join(cwd, '.env'));
  }
}
