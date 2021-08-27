import React from 'react';
import { Template, Zombi, mergePrompts } from 'zombi';
import { createScaffold } from 'core/utils/scaffold-helpers';
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
    installDependenciesCommand: NpmClientPrompt.getInstallCommand,
    startCommand: NpmClientPrompt.getStartCommand('dev'),
    flags: {
      ...NpmClientPrompt.flags,
      ...PublishableApiKeyPrompt.flags,
      ...SecretApiKeyPrompt.flags,
    },
  },
);
