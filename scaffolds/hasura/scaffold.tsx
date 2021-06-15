import React from 'react';
import { Template, Zombi } from 'compiled/zombi';
import { createScaffold } from 'core/utils/scaffold-helpers';
import { mergePrompts } from 'core/utils/merge-prompts';
import { NpmClientPrompt, PublishableApiKeyPrompt, SecretApiKeyPrompt } from 'scaffolds/prompts';
import crypto from 'crypto';

type HasuraData = NpmClientPrompt.Data &
  PublishableApiKeyPrompt.Data &
  SecretApiKeyPrompt.Data & {
    hasuraUrl: string;
    jwtSecret: string;
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
          name: 'hasuraUrl',
          message: "Enter your project's Hasura URL:",
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
        default: generateJwtSecret,
      },
    },
  },
);
