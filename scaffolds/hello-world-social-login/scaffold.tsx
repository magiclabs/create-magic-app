import React from 'react';
import { Template, Zombi } from 'compiled/zombi';
import { createScaffold } from 'core/utils/scaffold-helpers';
import { mergePrompts } from 'core/utils/merge-prompts';
import { NpmClientPrompt, PublishableApiKeyPrompt, SocialLoginsPrompt } from 'scaffolds/prompts';

type HelloWorldSocialLoginData = NpmClientPrompt.Data & PublishableApiKeyPrompt.Data & SocialLoginsPrompt.Data;

export default createScaffold<HelloWorldSocialLoginData>(
  (props) => (
    <Zombi
      {...props}
      prompts={mergePrompts(PublishableApiKeyPrompt.questions, SocialLoginsPrompt.questions, NpmClientPrompt.questions)}
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
              // In the demo app, we use the "react-social-login-buttons" NPM
              // package to render buttons. This package does not natively
              // support some of the providers that Magic does, so we need to
              // add additional image assets for these providers.
              const providersRequiringLogoTemplate = ['bitbucket', 'gitlab'];

              return (
                <React.Fragment key={provider}>
                  <Template source={`./src/social-logins/${provider}.js`} />
                  {providersRequiringLogoTemplate.includes(provider) && (
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
    startCommand: NpmClientPrompt.getStartCommand('start'),
    flags: {
      ...NpmClientPrompt.flags,
      ...PublishableApiKeyPrompt.flags,
      ...SocialLoginsPrompt.flags,
    },
  },
);
