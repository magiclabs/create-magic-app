import React from 'react';
import { Template, Zombi, mergePrompts } from 'zombi';
import { createScaffold } from 'core/utils/scaffold-helpers';
import { NpmClientPrompt, PublishableApiKeyPrompt } from 'scaffolds/prompts';

type HelloWorldData = NpmClientPrompt.Data & PublishableApiKeyPrompt.Data;

export default createScaffold<HelloWorldData>(
  (props) => (
    <Zombi {...props} prompts={mergePrompts(PublishableApiKeyPrompt.questions, NpmClientPrompt.questions)}>
      <Template source="./" />
    </Zombi>
  ),

  {
    shortDescription: 'Hello World With Magic Link',
    featured: false,
    installDependenciesCommand: NpmClientPrompt.getInstallCommand,
    startCommand: NpmClientPrompt.getStartCommand('start'),
    flags: {
      ...NpmClientPrompt.flags,
      ...PublishableApiKeyPrompt.flags,
    },
  },
);
