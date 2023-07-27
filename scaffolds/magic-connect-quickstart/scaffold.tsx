import React from 'react';
import { Template, Zombi, mergePrompts } from 'zombi';
import { createScaffold } from 'core/utils/scaffold-helpers';
import { NpmClientPrompt, PublishableApiKeyPrompt } from 'scaffolds/prompts';

export default createScaffold<PublishableApiKeyPrompt.Data & NpmClientPrompt.Data>(
  (props) => (
    <Zombi {...props} prompts={PublishableApiKeyPrompt.questions}>
      <Template source="./" />
    </Zombi>
  ),

  {
    shortDescription: 'Magic Connect Quickstart',
    installDependenciesCommand: NpmClientPrompt.getInstallCommand,
    startCommand: NpmClientPrompt.getStartCommand('dev'),
    flags: { ...NpmClientPrompt.flags, ...PublishableApiKeyPrompt.flags },
  },
);
