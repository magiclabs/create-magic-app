import React from 'react';
import { Template, Zombi } from 'zombi';
import { createScaffold } from 'cli/utils/scaffold-helpers';
import { NpmClientPrompt, PublicApiKeyPrompt } from 'cli/utils/common-prompts';
import { mergePrompts } from 'cli/utils/merge-prompts';

type BinanceSmartChainData = NpmClientPrompt.Data & PublicApiKeyPrompt.Data;

export default createScaffold<BinanceSmartChainData>(
  (props) => (
    <Zombi {...props} prompts={mergePrompts(PublicApiKeyPrompt.questions, NpmClientPrompt.questions)}>
      <Template source="./" />
    </Zombi>
  ),

  {
    shortDescription: 'Binance Smart Chain',
    installDependenciesCommand: NpmClientPrompt.getInstallCommand,
    startCommand: NpmClientPrompt.getStartCommand,
    docs: {
      ...NpmClientPrompt.docs,
      ...PublicApiKeyPrompt.docs,
    },
  },
);
