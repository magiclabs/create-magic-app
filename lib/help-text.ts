/* eslint-disable no-param-reassign */
/* eslint-disable consistent-return */

import chalk from 'compiled/chalk';
import decamelizeKeys from 'compiled/decamelize-keys';
import { BINARY } from './config';
import { getScaffoldDefinition } from './utils/scaffold-helpers';

const styled = {
  Usage: chalk.bold('Usage'),
  GlobalOptions: chalk.bold('Global Options'),
  Examples: chalk.bold('Examples'),
  sh: chalk.gray.dim('$'),
  bin: chalk.green(BINARY),
};

export function printHelp(scaffoldName?: string) {
  // Print basic usage information
  console.log(`${styled.Usage}\n`);
  console.log(`  ${styled.sh} ${styled.bin} [...options]`);

  // Print global options
  console.log(`\n\n${styled.GlobalOptions}\n`);
  console.log(
    printOptionsTable({
      '--project-name, -p': 'The name of your project. A top-level directory will be created from this value.',
      '--template, -t':
        'The base template to use. If omitted or invalid, the template will be prompted for interactively.',
      '--branch, -b': `The remote Git branch of \`${BINARY}\` from which to source templates. [default: "master"]`,
      '--version, -v': `Show which version of \`${BINARY}\` is currently in use.`,
      '--help, -h': `Show help (you're lookin' at it).`,
      '[...]': `Additional CLI flags are given as data to the template. Any data required by the template that's provided as CLI flags will not be prompted for interactively.`,
    }),
  );

  // Print template-specific options
  try {
    const { docs } = getScaffoldDefinition(scaffoldName!);

    if (docs) {
      const sectionHeading = chalk.bold(`Options for ${chalk.cyan(`\`${scaffoldName}\``)}`);
      console.log(`\n\n${sectionHeading}\n\n${printOptionsTable(docs)}`);
    }
  } catch {}

  // Print usage examples
  console.log(`\n\n${styled.Examples}\n`);
  console.log(
    [
      `  ${styled.sh} npx ${styled.bin}`,
      `  ${styled.sh} npx ${styled.bin} --version`,
      `  ${styled.sh} npx ${styled.bin} --template=hello-world`,
      `  ${styled.sh} npx ${styled.bin} --project-name=my-app`,
    ].join('\n'),
  );
}

/**
 * From the record of args to descriptions given by `source`,
 * output a printable table of arguments for the help text.
 */
function printOptionsTable(source: Record<string, string | undefined>) {
  // Get a list of rows containing de-camelized args
  // as keys and formatted description texts as values
  const rows: Array<[string, string]> = Object.entries(
    decamelizeKeys(source, '-') as Record<string, string>,
  ).map(([arg, helpText]) => [`  ${arg.startsWith('-') || arg.startsWith('[') ? arg : `--${arg}`}`, helpText]);

  const padding = 2; // Space between args column & description text

  const argColumnWidth = Math.max(...rows.map(([arg]) => arg.length));
  const helpTextColumnWidth = 80 - argColumnWidth - padding;

  // The formatted descriptions for each arg.
  const helpTexts = rows.map(([_, helpText]) =>
    formatDescription(helpText, helpTextColumnWidth, argColumnWidth + padding),
  );

  return rows
    .map(([arg], i) => [arg, helpTexts[i]].join(' '.repeat(argColumnWidth - arg.length + padding)))
    .join('\n\n');
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

    // Insert a new line at first whitespace of the line
    for (let i = maxWidth - 1; i >= 0; i--) {
      if (testWhiteSpace(str.charAt(i))) {
        res += [str.slice(0, i), '\n', ' '.repeat(leadingWhitespaceAmount)].join('');
        str = str.slice(i + 1);
        foundWhitespace = true;
        break;
      }
    }

    // Insert a new line at the `maxWidth` position
    // (the word is too long to wrap)
    if (!foundWhitespace) {
      res += [str.slice(0, maxWidth), '\n'].join('');
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
