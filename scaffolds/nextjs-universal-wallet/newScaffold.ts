import { Flags } from 'core/flags';
import BaseScaffold from 'core/types/BaseScaffold';
import { Prompt } from 'enquirer';
import { BlockchainNetworkPrompt, PublishableApiKeyPrompt } from 'scaffolds/prompts';
import * as fs from 'fs';

export type Data = BlockchainNetworkPrompt.Data & PublishableApiKeyPrompt.Data;

export const flags: Flags<Partial<Data>> = {
  publishableApiKey: {
    type: String,
    description: 'The Magic publishable API key for your app.',
  },
  network: {
    alias: 'n',
    type: String,
    description: 'The blockchain network to use',
  },
};

export default class UniversalScaffold extends BaseScaffold {
  public templateName = 'nextjs-universal-wallet';
  private data: Data;
  public source: string | string[] = './public/background.svg';

  constructor(data: Data) {
    super();
    this.data = data;
  }

  public getTemplateData() {
    return this.data;
  }

  public readTemplateDirs = (
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
          this.readTemplateDirs(`${root}/${file}`, (err, res) => {
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
}
