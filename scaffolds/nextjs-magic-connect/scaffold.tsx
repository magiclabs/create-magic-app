import React from 'react';
import { Template, Zombi, mergePrompts } from 'zombi';
import { createScaffold } from 'core/utils/scaffold-helpers';
import {
  BlockchainNetworkPrompt,
  NpmClientPrompt,
  PublishableApiKeyPrompt,
  SecretApiKeyPrompt,
} from 'scaffolds/prompts';

type NextMagicConnectData = NpmClientPrompt.Data & PublishableApiKeyPrompt.Data & BlockchainNetworkPrompt.Data;

export default createScaffold<NextMagicConnectData>(
  (props) => (
    <Zombi {...props} prompts={mergePrompts(PublishableApiKeyPrompt.questions, BlockchainNetworkPrompt.questions)}>
      <Template source="./" />
    </Zombi>
  ),

  {
    shortDescription: 'Magic Connect',
    installDependenciesCommand: NpmClientPrompt.getInstallCommand,
    startCommand: NpmClientPrompt.getStartCommand('dev'),
    flags: {
      ...NpmClientPrompt.flags,
      ...PublishableApiKeyPrompt.flags,
      ...BlockchainNetworkPrompt.flags,
    },
  },
);
