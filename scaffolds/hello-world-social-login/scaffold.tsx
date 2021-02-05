import React from 'react';
import { Template, Zombi } from 'zombi';
import { createScaffold } from 'cli/utils/scaffold-helpers';
import { NpmClientPrompt, PublicApiKeyPrompt, SocialLoginsPrompt } from 'cli/utils/common-prompts';
import { mergePrompts } from 'cli/utils/merge-prompts';

type HelloWorldSocialLoginData = NpmClientPrompt.Data & PublicApiKeyPrompt.Data & SocialLoginsPrompt.Data;

export default createScaffold<HelloWorldSocialLoginData>(
  (props) => (
    <Zombi
      {...props}
      prompts={mergePrompts(PublicApiKeyPrompt.questions, SocialLoginsPrompt.questions, NpmClientPrompt.questions)}
    >
      {(data) => {
        const enabledProviders = Array.isArray(data.socialLogins) ? data.socialLogins : [data.socialLogins];
        return (
          <>
            <Template source="./package.json" />
            <Template source="./public" />

            <Template source="./src/components" />
            <Template source="./src/index.js" />
            <Template source="./src/magic.js" />
            <Template source="./src/styles.css" />

            {enabledProviders.map((provider) => {
              return <Template key={provider} source={`./src/social-logins/${provider}.js`} />;
            })}
          </>
        );
      }}
    </Zombi>
  ),

  {
    shortDescription: 'Hello world with social logins',
    order: 0,
    installDependenciesCommand: NpmClientPrompt.getInstallCommand,
    startCommand: NpmClientPrompt.getStartCommand,
    flags: {
      ...NpmClientPrompt.flags,
      ...PublicApiKeyPrompt.flags,
      ...SocialLoginsPrompt.flags,
    },
  },
);
