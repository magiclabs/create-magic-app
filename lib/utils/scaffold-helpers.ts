/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */

import { getAbsoluteTemplatePath, resolveToDist } from './path-helpers';
import type { CreateMagicAppData } from '../create-app';

type ScaffoldRender<T = Record<string, any>> = (props: {
  name: string;
  templateRoot: string;
  data: T & CreateMagicAppData;
}) => JSX.Element;

type ScaffoldMetadata<T = Record<string, any>> = {
  shortDescription: string;
  installDependenciesCommand?: string | ((data: T & CreateMagicAppData) => string);
  startCommand?: string | ((data: T & CreateMagicAppData) => string);
  docs?: {
    [P in keyof T]?: string;
  };
};

export type ScaffoldDefinition<T = Record<string, any>> = ScaffoldRender<T> & ScaffoldMetadata<T>;

/**
 * Creates the definition object for a scaffolding template.
 *
 * The return value of this function should be the default export
 * of a `[root]/scaffolds/[scaffoldName]/scaffold.{ts,tsx}` file.
 */
export function createScaffold<T>(
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
