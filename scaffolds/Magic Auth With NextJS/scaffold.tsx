import React from 'react';
import { Template, Zombi, mergePrompts } from 'zombi';
import { createScaffold } from 'core/utils/scaffold-helpers';
import {
  BlockchainNetworkPrompt,
  NpmClientPrompt,
  PublishableApiKeyPrompt,
  SecretApiKeyPrompt,
} from 'scaffolds/prompts';

type NextMagicAuthData = NpmClientPrompt.Data &
  PublishableApiKeyPrompt.Data &
  SecretApiKeyPrompt.Data &
  BlockchainNetworkPrompt.Data;

export default createScaffold<NextMagicAuthData>(
  (props) => (
    <Zombi
      {...props}
      prompts={mergePrompts(
        PublishableApiKeyPrompt.questions,
        NpmClientPrompt.questions,
        BlockchainNetworkPrompt.questions,
      )}
    >
      <Template source="./" />
    </Zombi>
  ),

  {
    shortDescription: 'Magic Auth',
    installDependenciesCommand: NpmClientPrompt.getInstallCommand,
    startCommand: NpmClientPrompt.getStartCommand('dev'),
    flags: {
      ...NpmClientPrompt.flags,
      ...PublishableApiKeyPrompt.flags,
      ...SecretApiKeyPrompt.flags,
      ...BlockchainNetworkPrompt.flags,
    },
  },
);
