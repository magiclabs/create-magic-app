import React from 'react';
import { Template, Zombi } from 'zombi';
import { createScaffold } from 'core/utils/scaffold-helpers';
import { mergePrompts } from 'core/utils/merge-prompts';
import { NpmClientPrompt, PublishableApiKeyPrompt, SecretApiKeyPrompt } from 'scaffolds/prompts';
import crypto from 'crypto';

type HasuraData = NpmClientPrompt.Data &
  PublishableApiKeyPrompt.Data &
  SecretApiKeyPrompt.Data & {
    jwtSecret: string;
    hasuraGraphQLUrl: string;
    sessionLengthInDays: number;
  };

function generateJwtSecret() {
  const buffer = crypto.randomBytes(32);
  return buffer.toString('hex');
}

export default createScaffold<HasuraData>(
  (props) => (
    <Zombi
      {...props}
      prompts={mergePrompts(
        PublishableApiKeyPrompt.questions,
        SecretApiKeyPrompt.questions,
        {
          type: 'input',
          name: 'hasuraGraphQLUrl',
          message: "Enter your project's Hasura GraphQL URL:",
        },
        {
          type: 'input',
          name: 'sessionLengthInDays',
          message: 'Enter user session length in # of days:',
        },
        NpmClientPrompt.questions,
      )}
    >
      <Template source="./components" />
      <Template source="./lib" />
      <Template source="./pages" />
      <Template source="./public" />
      <Template source="./.env" />
      <Template source="./.gitignore" />
      <Template source="./next.config.js" />
      <Template source="./package.json" />
      <Template source="./README.md" />
      <Template source="./yarn.lock" />
    </Zombi>
  ),

  {
    shortDescription: 'Hasura',
    order: 14,
    installDependenciesCommand: NpmClientPrompt.getInstallCommand,
    startCommand: NpmClientPrompt.getStartCommand('dev'),
    flags: {
      ...NpmClientPrompt.flags,
      ...PublishableApiKeyPrompt.flags,
      ...SecretApiKeyPrompt.flags,

      jwtSecret: {
        type: String,
        description: 'The shared JWT secret between your app and Hasura.',
      },

      hasuraGraphQLUrl: {
        type: String,
        description: 'The GraphQL URL for your Hasura app.',
      },

      sessionLengthInDays: {
        type: Number,
        description: 'The User Session Length for each user.',
      },
    },
  },
);
