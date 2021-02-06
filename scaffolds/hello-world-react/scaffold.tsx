import React from 'react';
import { Template, Zombi } from 'zombi';
import { createScaffold } from 'cli/utils/scaffold-helpers';
import { mergePrompts } from 'cli/utils/merge-prompts';
import { NpmClientPrompt, PublicApiKeyPrompt } from 'scaffolds/prompts';

type HelloWorldReactData = NpmClientPrompt.Data & PublicApiKeyPrompt.Data;

export default createScaffold<HelloWorldReactData>(
  (props) => (
    <Zombi {...props} prompts={mergePrompts(PublicApiKeyPrompt.questions, NpmClientPrompt.questions)}>
      <Template source="./" />
    </Zombi>
  ),

  {
    shortDescription: 'Hello World (React)',
    order: 0,
    installDependenciesCommand: NpmClientPrompt.getInstallCommand,
    startCommand: NpmClientPrompt.getStartCommand,
    flags: {
      ...NpmClientPrompt.flags,
      ...PublicApiKeyPrompt.flags,
    },
  },
);
