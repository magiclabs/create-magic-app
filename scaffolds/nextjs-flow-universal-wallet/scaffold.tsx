import { Flags } from 'core/flags';
import BaseScaffold from 'core/types/BaseScaffold';
import { NpmClientPrompt, PublishableApiKeyPrompt } from 'scaffolds/prompts';

export type Data = NpmClientPrompt.Data & PublishableApiKeyPrompt.Data;

export const flags: Flags<Partial<Data>> = {
  ...NpmClientPrompt.flags,
  ...PublishableApiKeyPrompt.flags,
};

export default class FlowUniversalScaffold extends BaseScaffold {
  public templateName = 'nextjs-flow-universal-wallet';
  private data: Data;
  public installationCommand: string[] = ['npm', 'install'];
  public startCommand: string[] = ['npm', 'run', 'dev'];

  public source: string | string[] = './';

  constructor(data: Data) {
    super();
    this.data = data;
  }
}
