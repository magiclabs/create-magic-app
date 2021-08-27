import React from 'react';
import { Template, Zombi } from 'zombi';
import { createScaffold } from 'core/utils/scaffold-helpers';
import { mergePrompts } from 'core/utils/merge-prompts';
import { NpmClientPrompt, PublishableApiKeyPrompt, SecretApiKeyPrompt } from 'scaffolds/prompts';
import { StripeSecretApiKeyPrompt, StripePublishableApiKeyPrompt } from './stripePrompts';

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
