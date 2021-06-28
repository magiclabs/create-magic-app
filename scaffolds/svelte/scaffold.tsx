import React from 'react';
import { Template, Zombi } from 'compiled/zombi';
import { createScaffold } from 'cli/utils/scaffold-helpers';
import { mergePrompts } from 'cli/utils/merge-prompts';
import { NpmClientPrompt, PublishableApiKeyPrompt, SecretApiKeyPrompt } from 'scaffolds/prompts';

type SvelteData = NpmClientPrompt.Data & PublishableApiKeyPrompt.Data & SecretApiKeyPrompt.Data;

export default createScaffold<SvelteData>(
  (props) => (
    <Zombi
      {...props}
      prompts={mergePrompts(PublishableApiKeyPrompt.questions, SecretApiKeyPrompt.questions, NpmClientPrompt.questions)}
    >
      <Template source="./" />
    </Zombi>
  ),

  {
    shortDescription: 'Svelte Kit',
    order: 1,
    installDependenciesCommand: NpmClientPrompt.getInstallCommand,
    startCommand: NpmClientPrompt.getStartCommand('dev'),
    flags: {
      ...NpmClientPrompt.flags,
      ...PublishableApiKeyPrompt.flags,
      ...SecretApiKeyPrompt.flags,
    },
  },
);
