import React from 'react';
import { Template, Zombi } from 'zombi';
import { createScaffold } from 'cli/utils/scaffold-helpers';
import { NpmClientPrompt, PublicApiKeyPrompt } from 'cli/utils/common-prompts';
import { mergePrompts } from 'cli/utils/merge-prompts';

type HelloWorldData = NpmClientPrompt.Data & PublicApiKeyPrompt.Data;

export default createScaffold<HelloWorldData>(
  (props) => (
    <Zombi {...props} prompts={mergePrompts(PublicApiKeyPrompt.questions, NpmClientPrompt.questions)}>
      <Template source="./" />
    </Zombi>
  ),

  {
    shortDescription: 'Hello world',
    installDependenciesCommand: NpmClientPrompt.getInstallCommand,
    startCommand: NpmClientPrompt.getStartCommand,
    docs: {
      ...NpmClientPrompt.docs,
      ...PublicApiKeyPrompt.docs,
    },
  },
);
