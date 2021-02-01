import chalk from 'compiled/chalk';
import { BINARY } from './config';

const styled = {
  Usage: chalk.bold.underline('Usage'),
  Options: chalk.bold.underline('Options'),
  Examples: chalk.bold.underline('Examples'),
  sh: chalk.gray.dim('$'),
  bin: chalk.green(BINARY),
};

export const helpText = `
  ${styled.Usage}

    ${styled.sh} ${styled.bin} [...options]

  ${styled.Options}

    --project-name  The name of your project. A top-level directory will be
                    created from this value.

    --template      The base template to use. If omitted or invalid, the
                    template will be prompted for interactively.

    --version, -v   Show which version of \`${BINARY}\` is
                    currently in use.

    --help, -h      Show help (you're lookin' at it).

    [...]           Any additional CLI flags will be given as data to the
                    template. Any data required by the template that's provided
                    as CLI flags will not be prompted for interactively.

  ${styled.Examples}

    ${styled.sh} npx ${styled.bin}
    ${styled.sh} npx ${styled.bin} --version
    ${styled.sh} npx ${styled.bin} --template=hello-world
    ${styled.sh} npx ${styled.bin} --project-name=my-app
`;
