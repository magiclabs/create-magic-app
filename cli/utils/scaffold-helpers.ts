/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */

import { getAbsoluteTemplatePath, resolveToDist } from './path-helpers';
import type { CreateMagicAppData } from '../create-app';

type ValueType = string | string[] | number | number[] | boolean;

type ScaffoldFlagType<T extends ValueType = ValueType> = T extends string | string[]
  ? StringConstructor
  : T extends number | number[]
  ? NumberConstructor
  : T extends boolean
  ? BooleanConstructor
  : StringConstructor | NumberConstructor | BooleanConstructor;

type ScaffoldFlagBase<T extends ValueType = ValueType> = {
  /**
   * A factory function to transform raw command-line input
   * into the requisite native type (string, boolean, or number).
   */
  type: ScaffoldFlagType<T>;

  /**
   * A help-text description for this flag. This will be printed along with
   * global `make-magic` documentation when the respective template is used
   * alongside the standard `--help` flag.
   */
  description: string;

  /**
   * An optional validation function that may return an error message
   * to be raised indicating invalid command-line input.
   */
  validate?: (value: T) => (string | boolean | Promise<string | boolean>) | undefined;
};

/**
 * Configuration to modify the behavior of flag-based template data inputs.
 */
export type ScaffoldFlag<T extends ValueType = ValueType> = T extends Array<string | number>
  ? ScaffoldFlagBase<T> & { isMultiple: true }
  : ScaffoldFlagBase<T> & { isMultiple?: false };

/**
 * A record of `ScaffoldFlag` values with data types given by `T`.
 */
export type ScaffoldFlags<T extends Record<string, ValueType> = Record<string, any>> = {
  [P in keyof T]: ScaffoldFlag<T[P]>;
};

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
   * Provide an integer to modify the order in which this scaffold
   * is listed under the standard templates prompt.
   */
  order?: number;

  /**
   * Provides an optional shell command to install dependencies
   * required by the scaffolded project.
   */
  installDependenciesCommand?: string | ((data: T & CreateMagicAppData) => string);

  /**
   * Provides an optional shell command to start the scaffolded project.
   */
  startCommand?: string | ((data: T & CreateMagicAppData) => string);

  /**
   * Provides metadata about CLI flags that may be used
   * to input template data for this scaffold.
   */
  flags: ScaffoldFlags<T>;
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
