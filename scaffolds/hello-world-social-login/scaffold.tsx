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
        return (
          <>
            <Template source="./package.json" />
            <Template source="./public/index.html" />
            <Template source="./src/components" />
            <Template source="./src/index.js" />
            <Template source="./src/magic.js" />
            <Template source="./src/styles.css" />

            {data.socialLogin.map((provider) => {
              return (
                <React.Fragment key={provider}>
                  <Template source={`./src/social-logins/${provider}.js`} />
                  {['apple', 'bitbucket', 'gitlab'].includes(provider) && (
                    <Template source={`./public/img/${provider}.svg`} />
                  )}
                </React.Fragment>
              );
            })}
          </>
        );
      }}
    </Zombi>
  ),

  {
    shortDescription: 'Hello World with Social Logins',
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
