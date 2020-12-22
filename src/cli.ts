#!/usr/bin/env node

import meow from 'meow';
import execa from 'execa';
import CFonts from 'cfonts';
import { createApp } from './create-app';
import { makeDir } from './utils/make-dir';
import { TEMPLATE_ROOT } from './config';
import { helpText } from './help-text';

const cli = meow({
  flags: {
    help: { type: 'boolean', default: false, alias: 'h' },
    version: { type: 'boolean', default: false, alias: 'v' },
  },

  help: helpText,
  autoHelp: false,
});

function sayHello() {
  CFonts.say('Create|Magic|App', {
    font: 'tiny',
    align: 'left',
    colors: ['system'],
    space: true,
    gradient: ['#6851ff', '#a796ff'],
    transitionGradient: true,
  });
}

(async () => {
  if (cli.flags.version) cli.showVersion();

  if (cli.flags.help) {
    sayHello();
    cli.showHelp();
  }

  sayHello();

  // Make sure there's at least a root template directory to work from.
  await makeDir(TEMPLATE_ROOT);

  // Run the scaffold...
  const props = await createApp();

  // Add an empty line for "aesthetic"
  console.log();

  // Run the example app we just scaffolded!
  if (props.startCommand) {
    await execa.command(props.startCommand, { stdio: 'inherit' });
  }
})();
