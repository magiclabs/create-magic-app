import React from 'react';
import { Template, Zombi } from 'compiled/zombi';
import { createScaffold } from 'cli/utils/scaffold-helpers';
import { mergePrompts } from 'cli/utils/merge-prompts';
import { NpmClientPrompt, PublishableApiKeyPrompt, SecretApiKeyPrompt } from 'scaffolds/prompts';

type HasuraData = NpmClientPrompt.Data &
  PublishableApiKeyPrompt.Data &
  SecretApiKeyPrompt.Data & {
    hasuraUrl: string;
    jwtSecret: string;
  };

export default createScaffold<HasuraData>(
  (props) => (
    <Zombi
      {...props}
      prompts={mergePrompts(
        PublishableApiKeyPrompt.questions,
        SecretApiKeyPrompt.questions,

        {
          type: 'input',
          name: 'hasuraUrl',
          message: "Enter your project's Hasura URL:",
        },

        {
          type: 'input',
          name: 'jwtSecret',
          message: 'Enter your 32+ character JWT secret:',
        },

        NpmClientPrompt.questions,
      )}
    >
      <Template source="./" />
    </Zombi>
  ),

  {
    shortDescription: 'Hasura',
    order: 2,
    installDependenciesCommand: NpmClientPrompt.getInstallCommand,
    startCommand: NpmClientPrompt.getStartCommand('dev'),
    flags: {
      ...NpmClientPrompt.flags,
      ...PublishableApiKeyPrompt.flags,
      ...SecretApiKeyPrompt.flags,

      hasuraUrl: {
        type: String,
        description: 'The GraphQL URL for your Hasura app.',
      },

      jwtSecret: {
        type: String,
        description: 'The shared JWT secret between your app and Hasura.',
      },
    },
  },
);
