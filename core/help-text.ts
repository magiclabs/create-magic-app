/* eslint-disable no-param-reassign */
/* eslint-disable consistent-return */

import chalk from 'compiled/chalk';
import decamelizeKeys from 'compiled/decamelize-keys';
import wrapAnsi from 'compiled/wrap-ansi';
import { BINARY } from './config';
import { Flags, Flag } from './flags';
import { getScaffoldDefinition } from './utils/scaffold-helpers';

const styled = {
  Usage: chalk.bold.inverse(' USAGE '),
  Options: chalk.bold.inverse(' OPTIONS '),
  Examples: chalk.bold.inverse(' EXAMPLES '),
  sh: chalk.gray.dim('$'),
  bin: chalk.green(BINARY),
};

/**
 * Prints help text, including specific options for the given `scaffoldName`.
 */
export function printHelp(globalOptions: Flags, scaffoldName?: string) {
  const helpSections: string[] = [];

  // Basic usage information
  helpSections.push(
    createHelpSection({
      heading: styled.Usage,
      content: `  ${styled.sh} ${styled.bin} [...options]`,
    }),
  );

  // Global options
  helpSections.push(
    createHelpSection({
      heading: styled.Options,
      content: createOptionsTable({
        ...globalOptions,
        '[...]': `Additional CLI flags are given as data to the template. Any data required by the template that's provided as CLI flags will not be prompted for interactively.`,
      }),
    }),
  );

  // Template-specific options
  try {
    const { flags } = getScaffoldDefinition(scaffoldName!);
    helpSections.push(
      createHelpSection({
        heading: styled.Options + chalk.bold(' ❯ ') + chalk.bold.hex('#b93fff').inverse(` ${scaffoldName} `),
        content: createOptionsTable(flags as any),
      }),
    );
  } catch {}

  // Usage examples
  helpSections.push(
    createHelpSection({
      heading: styled.Examples,
      content: [
        `  ${styled.sh} npx ${styled.bin}`,
        `  ${styled.sh} npx ${styled.bin} --version`,
        `  ${styled.sh} npx ${styled.bin} --template=hello-world`,
        `  ${styled.sh} npx ${styled.bin} --project-name=my-app`,
      ].join('\n'),
    }),
  );

  // Print it out!
  console.log(helpSections.join('\n\n'));
}

/**
 * Join a help section heading together with its content.
 */
function createHelpSection(config: { heading: string; content: string }) {
  return `${config.heading}\n\n${config.content}`;
}

/**
 * From the record of args to descriptions given by `source`,
 * output a printable table of arguments for the help text.
 */
function createOptionsTable(flags: Record<string, string | Flag>) {
  const normalizeArg = (arg: string, config?: Flag) => {
    if (arg.startsWith('-') || arg.startsWith('[')) return arg;
    return config?.alias ? `--${arg}, -${config?.alias}` : `--${arg}`;
  };

  // Get a list of rows containing de-camelized args
  // as keys and formatted description texts as values
  const rows: Array<[string, string]> = Object.entries(
    decamelizeKeys(flags, '-') as Record<string, string | Flag>,
  ).map(([arg, config]) => [
    `  ${normalizeArg(arg, typeof config === 'string' ? undefined : config)}`,
    typeof config === 'string' ? config : config.description,
  ]);

  const gap = 2; // Space between args column & description text

  const argColumnWidth = Math.max(...rows.map(([arg]) => arg.length));
  const helpTextColumnWidth = 80 - argColumnWidth - gap;
  const helpTexts = rows.map(([_, helpText]) => formatDescription(helpText, helpTextColumnWidth, argColumnWidth + gap));

  return rows.map(([arg], i) => [arg, helpTexts[i]].join(' '.repeat(argColumnWidth - arg.length + gap))).join('\n\n');
}

/**
 * Wraps the source `str` at `maxWidth`, with leading whitespace for every line
 * after the first. Based on a very helpful StackOverflow answer by Ross Rogers.
 *
 * @see https://stackoverflow.com/questions/14484787/wrap-text-in-javascript
 */
function formatDescription(str: string, maxWidth: number, leadingWhitespaceAmount: number) {
  let res = '';
  let foundWhitespace;

  while (str.length > maxWidth) {
    foundWhitespace = false;

    // Insert a line break at first whitespace of the line
    for (let i = maxWidth - 1; i >= 0; i--) {
      if (testWhiteSpace(str.charAt(i))) {
        res += [str.slice(0, i), '\n', ' '.repeat(leadingWhitespaceAmount)].join('');
        str = str.slice(i + 1);
        foundWhitespace = true;
        break;
      }
    }

    // Insert a line break at the `maxWidth` position
    // (the word is too long to wrap)
    if (!foundWhitespace) {
      res += [wrapAnsi(str, maxWidth), '\n'].join('');
      str = str.slice(maxWidth);
    }
  }

  return `${res}${str}`.trimEnd();
}

/**
 * @see https://stackoverflow.com/questions/14484787/wrap-text-in-javascript
 */
function testWhiteSpace(x: string) {
  const white = new RegExp(/^\s$/);
  return white.test(x.charAt(0));
}
