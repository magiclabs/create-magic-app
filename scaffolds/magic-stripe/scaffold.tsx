import React from 'react';
import { Template, Zombi } from 'compiled/zombi';
import { createScaffold } from 'cli/utils/scaffold-helpers';
import { mergePrompts } from 'cli/utils/merge-prompts';
import {
  NpmClientPrompt,
  PublishableApiKeyPrompt,
  SecretApiKeyPrompt,
  StripeSecretApiKeyPrompt,
  StripePublishableApiKeyPrompt,
} from 'scaffolds/prompts';

type StripeMagicData = NpmClientPrompt.Data &
  PublishableApiKeyPrompt.Data &
  SecretApiKeyPrompt.Data &
  StripePublishableApiKeyPrompt.Data &
  StripeSecretApiKeyPrompt.Data;

export default createScaffold<StripeMagicData>(
  (props) => (
    <Zombi
      {...props}
      prompts={mergePrompts(
        PublishableApiKeyPrompt.questions,
        SecretApiKeyPrompt.questions,
        StripePublishableApiKeyPrompt.questions,
        StripeSecretApiKeyPrompt.questions,
        NpmClientPrompt.questions,
      )}
    >
      <Template source="./" />
    </Zombi>
  ),
  {
    shortDescription: 'Magic + Stripe',
    order: 0,
    installDependenciesCommand: NpmClientPrompt.getInstallCommand,
    startCommand: NpmClientPrompt.getStartCommand('start'),
    flags: {
      ...NpmClientPrompt.flags,
      ...PublishableApiKeyPrompt.flags,
      ...SecretApiKeyPrompt.flags,
      ...StripePublishableApiKeyPrompt.flags,
      ...StripeSecretApiKeyPrompt.flags,
    },
  },
);
