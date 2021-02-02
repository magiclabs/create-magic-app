import React from 'react';
import { Template, Zombi } from 'zombi';
import { createScaffold } from 'lib/utils/scaffold-helpers';
import { NpmClientPrompt, PublicApiKeyPrompt } from 'lib/utils/common-prompts';
import { mergePrompts } from 'lib/utils/merge-prompts';

type HelloWorldData = NpmClientPrompt.Data & PublicApiKeyPrompt.Data;

export default createScaffold<HelloWorldData>(
  (props) => (
    <Zombi {...props} prompts={mergePrompts(PublicApiKeyPrompt.questions, NpmClientPrompt.questions)}>
      <Template source="./" />
    </Zombi>
  ),

  {
    shortDescription: 'Just testing...',
    installDependenciesCommand: (data) => (data.npmClient === 'npm' ? 'npm install' : 'yarn install'),
    startCommand: (data) => (data.npmClient === 'npm' ? 'npm start' : 'yarn start'),
  },
);
