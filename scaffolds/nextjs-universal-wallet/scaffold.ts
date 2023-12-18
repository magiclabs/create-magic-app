import { Prompt } from 'enquirer';
import { Flags } from '../../core/flags';
import BaseScaffold, { ExecaCommand } from '../../core/types/BaseScaffold';
import { BlockchainNetworkPrompt, PublishableApiKeyPrompt } from '../../scaffolds/prompts';

export type Data = BlockchainNetworkPrompt.Data & PublishableApiKeyPrompt.Data;

export const flags: Flags<Partial<Data>> = { ...BlockchainNetworkPrompt.flags, ...PublishableApiKeyPrompt.flags };

export const definition = {
  shortDescription: 'A Universal Wallet scaffold for Next.js',
  featured: true,
};

export default class UniversalScaffold extends BaseScaffold {
  public templateName = 'nextjs-universal-wallet';
  private data: Data | undefined;
  public installationCommand: ExecaCommand = { command: 'npm', args: ['install'] };
  public startCommand: ExecaCommand = { command: 'npm', args: ['run', 'dev'] };
  public source: string | string[] = './';

  constructor(data: Data | undefined) {
    super();
    this.data = data;
  }
}
