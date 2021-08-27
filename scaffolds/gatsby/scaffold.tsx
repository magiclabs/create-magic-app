import React from 'react';
import { Template, Zombi } from 'compiled/zombi';
import { createScaffold } from 'core/utils/scaffold-helpers';
import { mergePrompts } from 'core/utils/merge-prompts';
import { NpmClientPrompt, PublishableApiKeyPrompt } from 'scaffolds/prompts';

type GatsbyData = NpmClientPrompt.Data & PublishableApiKeyPrompt.Data;

export default createScaffold<GatsbyData>(
  (props) => (
    <Zombi {...props} prompts={mergePrompts(PublishableApiKeyPrompt.questions, NpmClientPrompt.questions)}>
      <Template source="./src/components" />
      <Template source="./src/images" data={false} />
      <Template source="./src/lib" />
      <Template source="./src/pages" />
      <Template source="./src/util" />
      <Template source="./.env.development" />
      <Template source="./.gitignore" />
      <Template source="./.prettierrc" />
      <Template source="./.prettierignore" />
      <Template source="./gatsby-browser.js" />
      <Template source="./gatsby-config.js" />
      <Template source="./gatsby-node.js" />
      <Template source="./gatsby-ssr.js" />
      <Template source="./README.md" />
      <Template source="./package.json" />
    </Zombi>
  ),

  {
    shortDescription: 'Gatsby',
    installDependenciesCommand: NpmClientPrompt.getInstallCommand,
    startCommand: NpmClientPrompt.getStartCommand('develop'),
    flags: {
      ...NpmClientPrompt.flags,
      ...PublishableApiKeyPrompt.flags,
    },
  },
);
