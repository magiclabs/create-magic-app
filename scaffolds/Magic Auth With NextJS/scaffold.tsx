import React from 'react';
import { Template, Zombi, mergePrompts } from 'zombi';
import { createScaffold } from 'core/utils/scaffold-helpers';
import {
  AuthTypePrompt,
  BlockchainNetworkPrompt,
  NpmClientPrompt,
  PublishableApiKeyPrompt,
  SecretApiKeyPrompt,
} from 'scaffolds/prompts';

type NextMagicAuthData = NpmClientPrompt.Data &
  PublishableApiKeyPrompt.Data &
  SecretApiKeyPrompt.Data &
  BlockchainNetworkPrompt.Data &
  AuthTypePrompt.Data;

export default createScaffold<NextMagicAuthData>(
  (props) => (
    <Zombi
      {...props}
      prompts={mergePrompts(
        PublishableApiKeyPrompt.questions,
        NpmClientPrompt.questions,
        BlockchainNetworkPrompt.questions,
        AuthTypePrompt.questions,
      )}
    >
      {(data) => (
        <>
          <Template source="./public/background.svg" />
          <Template source="./public/favicon.ico" />
          <Template source="./public/magic_color_white.svg" />
          <Template source="./.env" />
          <Template source="./next-env.d.ts" />
          <Template source="./package.json" />
          <Template source="./postcss.config.js" />
          <Template source="./tailwind.config.js" />
          <Template source="./tsconfig.json" />
          <Template source="./src/components/provider" />
          <Template source="./src/components/send-transaction" />
          <Template source="./src/components/ui" />
          <Template source="./src/components/wallet" />
          <Template source="./src/components/wallet-methods" />
          <Template source="./src/pages" />
          <Template source="./src/styles" />
          <Template source="./src/utils" />

          {data.selectedAuthTypes.map((authType) => (
            <React.Fragment key={authType}>
              <Template source={`./public/social/${authType.replaceAll(' ', '')}.svg`} />
              <Template source={`./src/components/auth/${authType.replaceAll(' ', '')}.tsx`} />
            </React.Fragment>
          ))}
        </>
      )}
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
      ...AuthTypePrompt.flags,
    },
  },
);
