import React from 'react';
import { Template, Zombi } from 'compiled/zombi';
import { createScaffold } from 'cli/utils/scaffold-helpers';
import { mergePrompts } from 'cli/utils/merge-prompts';
import { NpmClientPrompt, PublishableApiKeyPrompt } from 'scaffolds/prompts';

type HelloWorldVueData = NpmClientPrompt.Data & PublishableApiKeyPrompt.Data;

export default createScaffold<HelloWorldVueData>(
  (props) => (
    <Zombi {...props} prompts={mergePrompts(PublishableApiKeyPrompt.questions, NpmClientPrompt.questions)}>
      <Template source="./src" />
      <Template source="./.env" />
      <Template source="./.gitignore" />
      <Template source="./.eslintrc.js" />
      <Template source="./babel.config.js" />
      <Template source="./package.json" />
      <Template source="./README.md" />
      <Template source="./public" data={false} />
    </Zombi>
  ),

  {
    shortDescription: 'Hello World (Vue)',
    order: 0,
    installDependenciesCommand: NpmClientPrompt.getInstallCommand,
    startCommand: NpmClientPrompt.getStartCommand('serve'),
    flags: {
      ...NpmClientPrompt.flags,
      ...PublishableApiKeyPrompt.flags,
    },
  },
);
