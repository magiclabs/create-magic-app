import { Flags } from 'core/flags';
import BaseScaffold from 'core/types/BaseScaffold';
import { Prompt } from 'enquirer';
import { BlockchainNetworkPrompt, PublishableApiKeyPrompt } from 'scaffolds/prompts';
import * as fs from 'fs';

export type Data = BlockchainNetworkPrompt.Data & PublishableApiKeyPrompt.Data;

export const flags: Flags<Partial<Data>> = { ...BlockchainNetworkPrompt.flags, ...PublishableApiKeyPrompt.flags };

export default class UniversalScaffold extends BaseScaffold {
  public templateName = 'nextjs-universal-wallet';
  private data: Data;
  public source: string | string[] = './';

  constructor(data: Data) {
    super();
    this.data = data;
  }
}
