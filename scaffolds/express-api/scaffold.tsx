import React from 'react';
import { Template, Zombi } from 'compiled/zombi';
import { createScaffold } from 'cli/utils/scaffold-helpers';
import { mergePrompts } from 'cli/utils/merge-prompts';
import { NpmClientPrompt, SecretApiKeyPrompt } from 'scaffolds/prompts';

type ExpressApiData = NpmClientPrompt.Data & SecretApiKeyPrompt.Data;

export default createScaffold<ExpressApiData>(
  (props) => (
    <Zombi {...props} prompts={mergePrompts(SecretApiKeyPrompt.questions, NpmClientPrompt.questions)}>
      <Template source="./" />
    </Zombi>
  ),

  {
    shortDescription: 'Express APIs',
    order: 0,
    installDependenciesCommand: NpmClientPrompt.getInstallCommand,
    startCommand: NpmClientPrompt.getStartCommand('start'),
    flags: {
      ...NpmClientPrompt.flags,
      ...SecretApiKeyPrompt.flags,
    },
  },
);
