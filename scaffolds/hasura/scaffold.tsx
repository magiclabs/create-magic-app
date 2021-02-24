import React from 'react';
import { Template, Zombi } from 'compiled/zombi';
import { createScaffold } from 'cli/utils/scaffold-helpers';
import { mergePrompts } from 'cli/utils/merge-prompts';
import { NpmClientPrompt, PublishableApiKeyPrompt, SecretApiKeyPrompt } from 'scaffolds/prompts';
import type { Questions } from 'compiled/zombi';
import type { Flags } from 'cli/flags';

// prompt specific to the Hasura template, therefore not in `scaffolds/prompts.ts`
namespace HasuraUrlPrompt {
  export type Data = {
    hasuraUrl: 'npm' | 'yarn';
  };

  export const questions: Questions<Data> = {
    type: 'input',
    name: 'hasuraUrl',
    message: "Enter your project's Hasura URL:",
  };

  export const flags: Flags<Data> = {
    hasuraUrl: {
      type: String,
      description: 'The GraphQL URL for your Hasura app.',
    },
  };
}

// prompt specific to the Hasura template, therefore not in `scaffolds/prompts.ts`
namespace JwtSecretPrompt {
  export type Data = {
    jwtSecret: 'npm' | 'yarn';
  };

  export const questions: Questions<Data> = {
    type: 'input',
    name: 'jwtSecret',
    message: 'Enter your 32+ character JWT secret:',
  };

  export const flags: Flags<Data> = {
    jwtSecret: {
      type: String,
      description: 'The shared JWT secret between your app and Hasura.',
    },
  };
}

type HasuraData = NpmClientPrompt.Data &
  PublishableApiKeyPrompt.Data &
  SecretApiKeyPrompt.Data &
  HasuraUrlPrompt.Data &
  JwtSecretPrompt.Data;

export default createScaffold<HasuraData>(
  (props) => (
    <Zombi
      {...props}
      prompts={mergePrompts(
        PublishableApiKeyPrompt.questions,
        SecretApiKeyPrompt.questions,
        HasuraUrlPrompt.questions,
        JwtSecretPrompt.questions,
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
    startCommand: (data: HasuraData) => {
      return data.npmClient === 'npm' ? 'npm run dev' : 'yarn dev';
    },
    flags: {
      ...NpmClientPrompt.flags,
      ...PublishableApiKeyPrompt.flags,
      ...SecretApiKeyPrompt.flags,
      ...HasuraUrlPrompt.flags,
      ...JwtSecretPrompt.flags,
    },
  },
);
