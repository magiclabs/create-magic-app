import React from 'react';
import { Template, Zombi } from 'zombi';
import { createScaffold } from 'core/utils/scaffold-helpers';
import { mergePrompts } from 'core/utils/merge-prompts';
import { NpmClientPrompt, PublishableApiKeyPrompt } from 'scaffolds/prompts';

type NuxtData = NpmClientPrompt.Data & PublishableApiKeyPrompt.Data;

export default createScaffold<NuxtData>(
  (props) => (
    <Zombi {...props} prompts={mergePrompts(PublishableApiKeyPrompt.questions, NpmClientPrompt.questions)}>
      <Template source="./components" />
      <Template source="./layouts" />
      <Template source="./middleware" />
      <Template source="./pages" />
      <Template source="./plugins" />
      <Template source="./static" data={false} />
      <Template source="./store" />
      <Template source="./.editorconfig" />
      <Template source="./.env" />
      <Template source="./.gitignore" />
      <Template source="./.prettierrc" />
      <Template source="./jsconfig.json" />
      <Template source="./nuxt.config.js" />
      <Template source="./package.json" />
      <Template source="./README.md" />
    </Zombi>
  ),

  {
    shortDescription: 'Nuxt JS',
    installDependenciesCommand: NpmClientPrompt.getInstallCommand,
    startCommand: NpmClientPrompt.getStartCommand('dev'),
    flags: {
      ...NpmClientPrompt.flags,
      ...PublishableApiKeyPrompt.flags,
    },
  },
);
