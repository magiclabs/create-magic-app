import React from 'react';
import { Template, Zombi } from 'compiled/zombi';
import { createScaffold } from 'cli/utils/scaffold-helpers';
import { mergePrompts } from 'cli/utils/merge-prompts';
import { NpmClientPrompt, PublishableApiKeyPrompt } from 'scaffolds/prompts';

type NuxtData = NpmClientPrompt.Data & PublishableApiKeyPrompt.Data;

export default createScaffold<NuxtData>(
  (props) => (
    <Zombi {...props} prompts={mergePrompts(PublishableApiKeyPrompt.questions, NpmClientPrompt.questions)}>
      <Template source="./" />
    </Zombi>
  ),

  {
    shortDescription: 'Nuxt JS',
    order: 0,
    installDependenciesCommand: NpmClientPrompt.getInstallCommand,
    startCommand: NpmClientPrompt.getStartCommand('dev'),
    flags: {
      ...NpmClientPrompt.flags,
      ...PublishableApiKeyPrompt.flags,
    },
  },
);
