import React from 'react';
import { Template, Zombi } from 'compiled/zombi';
import { createScaffold } from 'cli/utils/scaffold-helpers';
import { mergePrompts } from 'cli/utils/merge-prompts';
import { NpmClientPrompt, PublishableApiKeyPrompt, SecretApiKeyPrompt } from 'scaffolds/prompts';

type NextData = NpmClientPrompt.Data & PublishableApiKeyPrompt.Data & SecretApiKeyPrompt.Data;

export default createScaffold<NextData>(
  (props) => (
    <Zombi
      {...props}
      prompts={mergePrompts(PublishableApiKeyPrompt.questions, SecretApiKeyPrompt.questions, NpmClientPrompt.questions)}
    >
      <Template source="./" />
    </Zombi>
  ),

  {
    shortDescription: 'Next.js',
    order: 1,
    installDependenciesCommand: NpmClientPrompt.getInstallCommand,
    startCommand: (data: NextData) => {
      return data.npmClient === 'npm' ? 'npm run dev' : 'yarn dev';
    },
    flags: {
      ...NpmClientPrompt.flags,
      ...PublishableApiKeyPrompt.flags,
      ...SecretApiKeyPrompt.flags,
    },
  },
);
