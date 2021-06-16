import React from 'react';
import { Template, Zombi } from 'zombi';
import { createScaffold } from 'core/utils/scaffold-helpers';
import { mergePrompts } from 'core/utils/merge-prompts';
import { NpmClientPrompt, PublishableApiKeyPrompt } from 'scaffolds/prompts';

type HelloWorldReactData = NpmClientPrompt.Data & PublishableApiKeyPrompt.Data;

export default createScaffold<HelloWorldReactData>(
  (props) => (
    <Zombi {...props} prompts={mergePrompts(PublishableApiKeyPrompt.questions, NpmClientPrompt.questions)}>
      <Template source="./" />
    </Zombi>
  ),

  {
    shortDescription: 'Hello World (React)',
    order: 0,
    installDependenciesCommand: NpmClientPrompt.getInstallCommand,
    startCommand: NpmClientPrompt.getStartCommand('start'),
    flags: {
      ...NpmClientPrompt.flags,
      ...PublishableApiKeyPrompt.flags,
    },
  },
);
