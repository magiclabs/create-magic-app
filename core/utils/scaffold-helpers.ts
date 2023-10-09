/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */

import { getAbsoluteTemplatePath, resolveToDist, resolveToRoot } from './path-helpers';
import type { CreateMagicAppData } from '../create-app';
import type { Flags, ValueType } from '../flags';
import fs from 'fs';

/**
 * The render function for a `make-magic` scaffold.
 * This is bound to some default props required by the underlying `<Zombi>`.
 */
type ScaffoldRender<T extends Record<string, ValueType> = Record<string, any>> = (props: {
  name: string;
  templateRoot: string;
  data: T & CreateMagicAppData;
}) => JSX.Element;

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
  installDependenciesCommand?: string[] | ((data: T & CreateMagicAppData) => string[]);

  /**
   * Provides an optional shell command to start the scaffolded project.
   */
  startCommand?: string[] | ((data: T & CreateMagicAppData) => string[]);

  /**
   * Provides metadata about CLI flags that may be used
   * to input template data for this scaffold.
   */
  flags: Flags<Partial<T>>;
};

export type ScaffoldDefinition<T extends Record<string, ValueType> = Record<string, any>> = ScaffoldRender<T> &
  ScaffoldMetadata<T>;

/**
 * Creates the definition object for a scaffolding template.
 *
 * The return value of this function should be the default export
 * of a `[root]/scaffolds/[scaffoldName]/scaffold.{ts,tsx}` file.
 */
export function createScaffold<T extends Record<string, ValueType>>(
  scaffoldRender: ScaffoldRender<T>,
  metadata: ScaffoldMetadata<T>,
): ScaffoldDefinition<T> {
  return Object.assign(scaffoldRender, { ...metadata });
}

/**
 * Gets the definition object for a scaffolding template.
 */
export function getScaffoldDefinition(scaffoldName: string): ScaffoldDefinition {
  // We are requiring this file in context of the
  // transpiled `/dist` output, so we use a JS extension...
  return require(resolveToDist('scaffolds', scaffoldName, 'scaffold.js')).default;
}

/**
 * Gets the render function for a scaffolding template.
 * The returned function is bound with `data` and some initial `Zombi` props.
 */
export function getScaffoldRender(data: CreateMagicAppData & Record<string, any>): () => JSX.Element {
  // We are requiring this file in context of the
  // transpiled `/dist`, so we use a JS extension...
  const scaffoldModule = getScaffoldDefinition(data.template);

  return scaffoldModule.bind(scaffoldModule, {
    data,
    name: data.template,
    templateRoot: getAbsoluteTemplatePath(data.template),
  });
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
  process.chdir(projectName as string);
}
