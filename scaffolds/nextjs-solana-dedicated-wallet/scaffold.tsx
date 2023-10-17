import { Flags } from 'core/flags';
import BaseScaffold, { ExecaCommand } from 'core/types/BaseScaffold';
import { AuthTypePrompt, NpmClientPrompt, PublishableApiKeyPrompt } from 'scaffolds/prompts';

export type Data = NpmClientPrompt.Data & PublishableApiKeyPrompt.Data & AuthTypePrompt.Data;

export const flags: Flags<Partial<Data>> = {
  ...NpmClientPrompt.flags,
  ...PublishableApiKeyPrompt.flags,
  ...AuthTypePrompt.flags,
};

export const definition = {
  shortDescription: 'A dedicated wallet scaffold for Next.js using Solana',
  featured: true,
};

export default class SolanaDedicatedScaffold extends BaseScaffold {
  public templateName = 'nextjs-solana-dedicated-wallet';
  private data: Data;
  public installationCommand: ExecaCommand = { command: 'npm', args: ['install'] };
  public startCommand: ExecaCommand = { command: 'npm', args: ['run', 'dev'] };
  public source: string | string[] = [
    './public/favicon.ico',
    './public/logo.svg',
    './public/info.svg',
    './public/link.svg',
    './public/link_white.svg',
    './public/redirect_bg.png',
    './public/login_bg.png',
    './.env.example',
    './.eslintrc.json',
    './.gitignore',
    './package.json',
    './postcss.config.js',
    './tailwind.config.js',
    './tsconfig.json',
    './README.md',
    './src/components/ui',
    './src/components/magic/cards',
    './src/components/magic/wallet-methods/Disconnect.tsx',
    './src/components/magic/wallet-methods/GetIdToken.tsx',
    './src/components/magic/wallet-methods/GetMetadata.tsx',
    './src/components/magic/Dashboard.tsx',
    './src/components/magic/DevLinks.tsx',
    './src/components/magic/Header.tsx',
    './src/components/magic/Login.tsx',
    './src/components/magic/MagicProvider.tsx',
    './src/components/magic/MagicDashboardRedirect.tsx',
    './src/pages',
    './src/styles',
    './src/utils',
  ];

  constructor(data: Data) {
    super();
    this.data = data;

    if (typeof this.source !== 'string') {
      data.loginMethods.forEach((authType) => {
        (this.source as string[]).push(`./src/components/magic/auth/${authType.replaceAll(' ', '')}.tsx`);
        (authType === 'Discord' ||
          authType === 'Facebook' ||
          authType === 'Github' ||
          authType === 'Google' ||
          authType === 'Twitch' ||
          authType === 'Twitter') &&
          (this.source as string[]).push(`./public/social/${authType.replaceAll(' ', '')}.svg`);
        authType.replaceAll(' ', '') === 'EmailOTP' &&
          (this.source as string[]).push('./src/components/magic/wallet-methods/UpdateEmail.tsx');
        authType.replaceAll(' ', '') === 'SMSOTP' &&
          (this.source as string[]).push('./src/components/magic/wallet-methods/UpdatePhone.tsx');
      });
    }
  }
}
