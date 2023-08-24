import React from 'react';
import { Template, Zombi, mergePrompts } from 'zombi';
import { createScaffold } from 'core/utils/scaffold-helpers';
import { BlockchainNetworkPrompt, NpmClientPrompt, PublishableApiKeyPrompt } from 'scaffolds/prompts';

type NextUniversalWalletData = NpmClientPrompt.Data & PublishableApiKeyPrompt.Data & BlockchainNetworkPrompt.Data;

export default createScaffold<NextUniversalWalletData>(
  (props) => (
    <Zombi {...props} prompts={mergePrompts(BlockchainNetworkPrompt.questions, PublishableApiKeyPrompt.questions)}>
      <Template source="./" />
    </Zombi>
  ),

  {
    shortDescription: 'Universal Wallet',
    installDependenciesCommand: NpmClientPrompt.getInstallCommand,
    startCommand: NpmClientPrompt.getStartCommand('dev'),
    flags: {
      ...NpmClientPrompt.flags,
      ...PublishableApiKeyPrompt.flags,
      ...BlockchainNetworkPrompt.flags,
    },
  },
);
