# Contributing

When contributing to this repository, please first discuss the change you wish to make via an **issue**. This can be a feature request or a bug report. After a maintainer has triaged your issue, you are welcome to collaborate on a pull request. If your change is small or uncomplicated, you are welcome to open an issue and pull request simultaneously.

Please note we have a **code of conduct**, please follow it in all your interactions with the project.

## Setting up for Local Development

1. Fork this repository.
2. Clone your fork.
3. Create a new branch in your local repository with the following pattern:

- For bug fixes: `bug/[issue_number]/[descriptive_bug_name]`
- For features: `feature/[issue_number]/[descriptive_feature_name]`
- For chores/the rest: `chore/[descriptive_chore_name]`

4. Install dependencies with Yarn: `yarn install`
5. Add `./node_modules/.bin` to your system's [`PATH`](<https://en.wikipedia.org/wiki/PATH_(variable)>), if it's not already listed.
6. Start building for development: `yarn dev`

### Development Scripts

| NPM Script          | Description                                     |
| --------------------| ------------------------------------------------|
| `yarn dev`          | Start building the CLI tool in development mode.|
| `yarn build`        | Build the CLI tool for production.              |
| `yarn clean`        | Run cleaning scripts.                           |
| `yarn lint`         | Run the linter.                                 |
| `yarn test`         | Run unit tests.                                 |
| `yarn template-dev` | Run development command for a specific template. Most changes will hot-reload|

## Opening a Pull Request

1. Open a pull request from your fork/branch to the upstream `master` branch of _this_ repository.
2. Add a label for the [semver](https://semver.org/) update corresponding to your changes: `patch`, `minor`, or `major`.
3. A maintainer will review your code changes and offer feedback or suggestions if necessary. Once your changes are approved, a maintainer will merge the pull request for you and publish a release.

## Cutting a release

We use [`auto`](https://github.com/intuit/auto) as our continuous delivery tool. Cutting a release is just a matter of merging to `master`. For pre-releases, you can create a `next` branch as the base for your experimental/W.I.P. feature. Please familiarize yourself with the [documentation for `auto`](https://intuit.github.io/auto/docs) if you are in a position to cut a release.

## Community Templates

### Adding a new template

1. Fork the repository.
2. Create a new branch `feat/<template_name>`.
3. Create a new directory under `scaffolds` named `<template_name>`.
4. Under that, create a `<template>` directory which will contain the source code.
5. Create a `scaffold.ts` as well under the `<template_name>` directory.
6. Modify `core/utils/templateMappings.ts` accordingly to include the new template.
7. If your project uses `.env`, make sure it is named as `.env.example`

### Updating existing template

1. If there are changes in the template source itself, edit the template from `scaffolds/<template_name>/template`.
2. If there are changes in the scaffold declaration, edit the `scaffolds/<template_name>/scaffold.ts`.
3. Change `core/utils/templateMappings.ts` accordingly to incorporate new changes.

### Adding / Updating prompts

Magic CLI uses `enquirer` package to create prompts for the templates.

#### Adding a new prompt

1. Create the `<PromptNamespace>` in `scaffolds/prompts.ts`
2. Make sure your prompt includes an exported type named `Data` and `flags` object. This will be used to show `--help` for the template specific options.
3. If your prompt needs questions, export those questions in respective functions.

Here's an example:

```ts
export namespace GreetingPrompt {
  //This type will be used in `scaffold.ts` to determine the type of data on which the template depends on
  export type Data = {
    Name: string;
  };

  //This prompt will be called if the data is not provided in flag arguments when calling the CLI
  export const askName = async () =>
    new Input({
      name: 'Name',
      message: 'What is your name?',
      initial: 'John Doe',
    }).run();

  //Used for declaring flags, their aliases and providing help description
  export const flags: Flags<Partial<Data>> = {
    Name: {
      type: String,
      description: 'Your name.',
    },
  };
}
```

#### Updating a prompt

Edit the `scaffolds/prompts.ts` to update the desired prompt.

> Update the `scaffolds/<template_name>/scaffold.ts` files which depend on the newly added / edited templates appropriately. Also, make necessary changes to `core/utils/templateMappings.ts`.

### EJS Templates

Magic CLI uses `ejs` package to embed Javascript templates in the code which needs to change dynamically based on CLI inputs. If your template uses EJS embedding, make sure to add default values for your template in the `scaffolds/dev-data.ts` file. Make sure that the properties in the default valies matches that of the flags on which your template depends on.

You can run and test the template with `npm run template-dev <template-name>` script to make sure that the template is working as expected.

## Contributor Covenant Code of Conduct

### Our Pledge

We as members, contributors, and leaders pledge to make participation in our
community a harassment-free experience for everyone, regardless of age, body
size, visible or invisible disability, ethnicity, sex characteristics, gender
identity and expression, level of experience, education, socio-economic status,
nationality, personal appearance, race, religion, or sexual identity
and orientation.

We pledge to act and interact in ways that contribute to an open, welcoming,
diverse, inclusive, and healthy community.

### Our Standards

Examples of behavior that contributes to a positive environment for our
community include:

- Demonstrating empathy and kindness toward other people
- Being respectful of differing opinions, viewpoints, and experiences
- Giving and gracefully accepting constructive feedback
- Accepting responsibility and apologizing to those affected by our mistakes, and learning from the experience
- Focusing on what is best not just for us as individuals, but for the overall community

Examples of unacceptable behavior include:

- The use of sexualized language or imagery, and sexual attention or advances of any kind
- Trolling, insulting or derogatory comments, and personal or political attacks
- Public or private harassment
- Publishing others' private information, such as a physical or email address, without their explicit permission
- Other conduct which could reasonably be considered inappropriate in a professional setting

### Enforcement Responsibilities

Community leaders are responsible for clarifying and enforcing our standards of
acceptable behavior and will take appropriate and fair corrective action in
response to any behavior that they deem inappropriate, threatening, offensive,
or harmful.

Community leaders have the right and responsibility to remove, edit, or reject
comments, commits, code, wiki edits, issues, and other contributions that are
not aligned to this Code of Conduct, and will communicate reasons for moderation
decisions when appropriate.

### Scope

This Code of Conduct applies within all community spaces, and also applies when
an individual is officially representing the community in public spaces.
Examples of representing our community include using an official e-mail address,
posting via an official social media account, or acting as an appointed
representative at an online or offline event.

### Enforcement

Instances of abusive, harassing, or otherwise unacceptable behavior may be
reported to the community leaders responsible for enforcement at [support@magic.link](mailto:support@magic.link).
All complaints will be reviewed and investigated promptly and fairly.

All community leaders are obligated to respect the privacy and security of the
reporter of any incident.

### Enforcement Guidelines

Community leaders will follow these Community Impact Guidelines in determining
the consequences for any action they deem in violation of this Code of Conduct:

#### 1. Correction

**Community Impact**: Use of inappropriate language or other behavior deemed
unprofessional or unwelcome in the community.

**Consequence**: A private, written warning from community leaders, providing
clarity around the nature of the violation and an explanation of why the
behavior was inappropriate. A public apology may be requested.

#### 2. Warning

**Community Impact**: A violation through a single incident or series
of actions.

**Consequence**: A warning with consequences for continued behavior. No
interaction with the people involved, including unsolicited interaction with
those enforcing the Code of Conduct, for a specified period of time. This
includes avoiding interactions in community spaces as well as external channels
like social media. Violating these terms may lead to a temporary or
permanent ban.

#### 3. Temporary Ban

**Community Impact**: A serious violation of community standards, including
sustained inappropriate behavior.

**Consequence**: A temporary ban from any sort of interaction or public
communication with the community for a specified period of time. No public or
private interaction with the people involved, including unsolicited interaction
with those enforcing the Code of Conduct, is allowed during this period.
Violating these terms may lead to a permanent ban.

#### 4. Permanent Ban

**Community Impact**: Demonstrating a pattern of violation of community
standards, including sustained inappropriate behavior, harassment of an
individual, or aggression toward or disparagement of classes of individuals.

**Consequence**: A permanent ban from any sort of public interaction within
the community.

### Attribution

This Code of Conduct is adapted from the [Contributor Covenant](https://www.contributor-covenant.org),
version 2.0, available at
https://www.contributor-covenant.org/version/2/0/code_of_conduct.html.

Community Impact Guidelines were inspired by [Mozilla's code of conduct
enforcement ladder](https://github.com/mozilla/diversity).

For answers to common questions about this code of conduct, see the FAQ at
https://www.contributor-covenant.org/faq. Translations are available at
https://www.contributor-covenant.org/translations.
