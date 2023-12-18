import { Flags } from '../../core/flags';
import BaseScaffold, { ExecaCommand } from '../../core/types/BaseScaffold';
import { NpmClientPrompt, PublishableApiKeyPrompt } from '../../scaffolds/prompts';

export type Data = NpmClientPrompt.Data & PublishableApiKeyPrompt.Data;

export const flags: Flags<Partial<Data>> = {
  ...NpmClientPrompt.flags,
  ...PublishableApiKeyPrompt.flags,
};

export const definition = {
  shortDescription: 'A universal wallet scaffold for Next.js using Flow',
  featured: true,
};

export default class FlowUniversalScaffold extends BaseScaffold {
  public templateName = 'nextjs-flow-universal-wallet';
  private data: Data | undefined;
  public installationCommand: ExecaCommand = { command: 'npm', args: ['install'] };
  public startCommand: ExecaCommand = { command: 'npm', args: ['run', 'dev'] };
  public source: string | string[] = './';

  constructor(data: Data | undefined) {
    super();
    this.data = data;
  }
}
