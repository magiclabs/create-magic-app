/* eslint-disable no-param-reassign */
/* eslint-disable consistent-return */

import chalk from 'chalk';
import decamelize from 'decamelize';
import wrapAnsi from 'wrap-ansi';
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
      content: `  ${styled.sh} ${styled.bin} [options]`,
    }),
  );

  // Global options
  helpSections.push(
    createHelpSection({
      heading: styled.Options,
      content: createOptionsTable({
        ...globalOptions,
        '[...]': chalk`Additional CLI flags are given as data to the chosen template. Data provided as CLI flags will {italic not be prompted for interactively.}`,
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
    return config?.alias
      ? `--${decamelize(arg, { separator: '-' })}, -${config?.alias}`
      : `--${decamelize(arg, { separator: '-' })}`;
  };

  // Get a list of rows containing de-camelized args
  // as keys and formatted description texts as values
  const rows: Array<[string, string]> = Object.entries(flags).map(([arg, config]) => {
    const configStr = typeof config === 'string' ? config : config.description + getDefaultArgLabel(config);

    return [`  ${normalizeArg(arg, typeof config === 'string' ? undefined : config)}`, configStr];
  });

  const gap = 3; // Space between args column & description text
  const maxWidth = 80 - gap;
  const argColumnWidth = Math.max(...rows.map(([arg]) => arg.length));

  const helpTexts = rows.map(([_, helpText]) => formatDescription(helpText, maxWidth, argColumnWidth + gap));

  return rows.map(([arg], i) => [arg, helpTexts[i]].join(' '.repeat(argColumnWidth - arg.length + gap))).join('\n\n');
}

/**
 * Creates a default value label based on the
 * value type associated to the given `flag`.
 */
function getDefaultArgLabel(flag: Flag) {
  const type = Array.isArray(flag.default) ? typeof flag.default[0] : typeof flag.default;
  const value = Array.isArray(flag.default)
    ? `[${(flag.default as any).map(JSON.stringify).join(', ')}]`
    : JSON.stringify(flag.default);

  switch (type) {
    case 'string':
    case 'number':
    case 'boolean':
      return chalk` {dim Default: {yellow ${value}}}`;

    case 'function':
      return chalk` {dim Default: {yellow.italic auto-generated at runtime}}`;

    default:
      return '';
  }
}

/**
 * Wraps the source `str` at `maxWidth`,
 * with leading whitespace for every line after the first.
 */
function formatDescription(str: string, maxWidth: number, leadingWhitespaceAmount: number) {
  const result = wrapAnsi(str, maxWidth - leadingWhitespaceAmount);
  return result.split('\n').join(`\n${' '.repeat(leadingWhitespaceAmount)}`);
}
