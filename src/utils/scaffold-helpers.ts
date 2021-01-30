/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */

import { getAbsoluteTemplatePath, resolveToDist } from './path-helpers';
import type { CreateMagicAppData } from '../create-app';

type ScaffoldRender = (data: CreateMagicAppData, props: { name: string; templateRoot: string }) => JSX.Element;
type ScaffoldMetadata = {
  shortDescription: string;
};

export type ScaffoldDefinition = ScaffoldRender & ScaffoldMetadata;

/**
 * Creates the definition object for a scaffolding template.
 *
 * The return value of this function should be the default export
 * of a `[root]/scaffolds/[scaffoldName]/scaffold.tsx` file.
 */
export function createScaffold(scaffoldRender: ScaffoldRender, metadata: ScaffoldMetadata): ScaffoldDefinition {
  return Object.assign(scaffoldRender, { ...metadata });
}

/**
 * Gets the definition object for a scaffolding template.
 */
export function getScaffoldDefinition(scaffoldName: string): ScaffoldDefinition {
  // We are requiring this file in context of the
  // transpiled `/dist`, so we use a JS extension...
  return require(resolveToDist('scaffolds', scaffoldName, 'scaffold.js')).default;
}

/**
 * Gets the render function for a scaffolding template.
 * The return function renders with `data` and `Zombi` props already bound.
 */
export function getScaffoldRender(data: CreateMagicAppData): () => JSX.Element {
  // We are requiring this file in context of the
  // transpiled `/dist`, so we use a JS extension...
  const scaffoldModule = getScaffoldDefinition(data.scaffoldName);

  return scaffoldModule.bind(scaffoldModule, data, {
    name: data.scaffoldName,
    templateRoot: getAbsoluteTemplatePath(data.scaffoldName),
  });
}
