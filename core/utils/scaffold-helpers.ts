/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */

import fs from 'fs';
import { ExecaCommand } from 'core/types/BaseScaffold';
import { getAbsoluteTemplatePath, resolveToDist, resolveToRoot } from './path-helpers';
import type { CreateMagicAppData } from '../create-app';
import type { Flags, ValueType } from '../flags';

/**
 * Metadata about the scaffold being defined.
 */
type ScaffoldMetadata<T extends Record<string, ValueType> = Record<string, any>> = {
  /**
   * This will be printed as the display name for this scaffold
   * under the standard templates prompt.
   */
  shortDescription: string;

  /**
   * If true, shows this scaffold with greater prominence in the templates
   * prompt. If provided with an object containing a numeric `order` field, that
   * will be used to sort this scaffold amongst the other featured scaffolds.
   */
  featured?: boolean | { order: number };

  /**
   * Provides an optional shell command to install dependencies
   * required by the scaffolded project.
   */
  installDependenciesCommand?: ExecaCommand | ((data: T & CreateMagicAppData) => ExecaCommand);

  /**
   * Provides an optional shell command to start the scaffolded project.
   */
  startCommand?: ExecaCommand | ((data: T & CreateMagicAppData) => ExecaCommand);

  /**
   * Provides metadata about CLI flags that may be used
   * to input template data for this scaffold.
   */
  flags: Flags<Partial<T>>;
};

export type ScaffoldDefinition<T extends Record<string, ValueType> = Record<string, any>> = ScaffoldMetadata<T>;

/**
 * Gets the definition object for a scaffolding template.
 */
export function getScaffoldDefinition(scaffoldName: string): ScaffoldDefinition {
  // We are requiring this file in context of the
  // transpiled `/dist` output, so we use a JS extension...
  return require(resolveToDist('scaffolds', scaffoldName, 'scaffold.js')).definition;
}

/**
 * Creates a new project directory if it doesn't exist and makes it cwd.
 * @param cwd Destination directory where the scaffold will be created
 * @param projectName Project name
 */
export function createProjectDirIfDoesntExists(cwd: string, projectName: string) {
  if (!fs.existsSync(resolveToRoot(cwd, projectName))) {
    fs.mkdirSync(resolveToRoot(cwd, projectName));
  }
  process.chdir(projectName);
}
