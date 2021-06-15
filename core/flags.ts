import decamelize from 'compiled/decamelize';
import parseArgs from 'compiled/yargs-parser';
import { createValidationError } from './utils/errors-warnings';
import { filterNilValues } from './utils/filter-nil-values';

export type ValueType = string | string[] | number | number[] | boolean;

type FlagType<T extends ValueType = ValueType> = T extends string
  ? StringConstructor
  : T extends string[]
  ? [StringConstructor]
  : T extends number
  ? NumberConstructor
  : T extends number[]
  ? [NumberConstructor]
  : T extends boolean
  ? BooleanConstructor
  : StringConstructor | NumberConstructor | BooleanConstructor;

/**
 * Configuration to modify the behavior of flag-based template data inputs.
 */
type BaseFlag<T extends ValueType = ValueType> = {
  /**
   * A factory function to transform raw command-line input
   * into the requisite native type (string, boolean, or number).
   */
  readonly type: FlagType<T>;

  /**
   * A single-character alias which can be used to assign the CLI flag in an
   * abbreviated way. For example, `--help` has the alias `h`, which can be used
   * like `-h`.
   */
  readonly alias?: string;

  /**
   * A help-text description for this flag. This will be printed along with
   * global `make-magic` documentation when the respective template is used
   * alongside the standard `--help` flag.
   */
  readonly description: string;

  /**
   * An optional validation function that may return an error message
   * to be raised indicating invalid command-line input.
   */
  readonly validate?: (value: T) => (string | boolean | Promise<string | boolean>) | undefined;

  /**
   * Provides a default value for the flag.
   */
  readonly default?: T | (() => T);
};

/**
 * Configuration to modify the behavior of flag-based template data inputs.
 */
type BaseFlagWithRequiredDefault<T extends ValueType = ValueType> = BaseFlag<T> & {
  /**
   * Provides a default value for the flag.
   */
  readonly default: T | (() => T);
};

/**
 * Configuration to modify the behavior of flag-based template data inputs.
 */
export type Flag<T extends ValueType = ValueType> = BaseFlag<T> | BaseFlagWithRequiredDefault<T>;

/**
 * A record of `ScaffoldFlag` values with data types given by `T`.
 */
export type Flags<T extends Record<string, ValueType | null | undefined> = Record<string, any>> = {
  [P in keyof Required<T>]: undefined extends T[P]
    ? BaseFlag<NonNullable<T[P]>>
    : null extends T[P]
    ? BaseFlag<NonNullable<T[P]>>
    : BaseFlagWithRequiredDefault<NonNullable<T[P]>>;
};

export type TypedFlags<F extends Flags> = F extends Flags<infer R> ? R : unknown;

/**
 * Parse and validate input given by the user via CLI flags.
 */
export async function parseFlags<T extends Flags>(flags: T, input?: string | {}): Promise<TypedFlags<T>> {
  const aliases: Record<string, string[]> = {};
  const booleans: string[] = [];

  Object.entries(flags).forEach(([flag, options]) => {
    if (options.alias) {
      aliases[flag] = [options.alias];
    }

    if (options.type === Boolean) {
      booleans.push(flag);
    }
  });

  const results: {} =
    typeof input === 'string' || input == null
      ? parseArgs(input || process.argv.slice(2), {
          alias: aliases,
          boolean: booleans,
        })
      : input;

  const defaultResults = getFlagDefaults(flags);
  const validatedResults = await validateFlagInputs(flags, results);
  const finalResults = { ...defaultResults, ...validatedResults };

  // If `input` is provided as an object of data, we validate that all required
  // data fields are present in the final results. For cases where `input` is
  // provided as a string, we can safely assume the CLI flow is being used, in
  // which case we don't worry about missing fields.
  if (input && typeof input !== 'string') {
    const requiredFields = Object.keys(flags).filter((flag) => flags[flag].default == null);
    const givenFields = Object.keys(results);
    const missingFields = requiredFields
      .map((field) => {
        if (!givenFields.includes(field)) return field;
        return undefined;
      })
      .filter(Boolean);

    if (missingFields.length) {
      throw createValidationError(`Missing required template data (${missingFields.join(', ')})`);
    }
  }

  return finalResults;
}

function getFlagDefaults<T extends Flags>(flags: T) {
  return filterNilValues<TypedFlags<T>>(
    Object.fromEntries(
      Object.keys(flags)
        .filter((flag) => flags[flag].default != null)
        .map((key) => {
          const flag = (flags[key] as unknown) as Flag;
          return [key, typeof flag.default === 'function' ? flag.default() : flag.default];
        }),
    ) as TypedFlags<T>,
  );
}

async function validateFlagInputs<T extends Flags>(flags: T, inputs: {} = {}) {
  return filterNilValues<TypedFlags<T>>(
    Object.fromEntries(
      await Promise.all(
        Object.entries(inputs).map(async ([key, value]) => {
          const flag = (flags[key] as unknown) as Flag;

          if (flag) {
            // Coerce result type
            const typeFactory = flag.type;
            let result: any;
            if (Array.isArray(typeFactory)) {
              result = Array.isArray(value) ? value.map((i) => typeFactory[0](i)) : [typeFactory[0](value)];
            } else {
              // In the case that we expect the flag argument to NOT be an
              // array, but we receive multiple instances of the flag anyway,
              // we simply use the last instance.
              result = Array.isArray(value) ? typeFactory(value[value.length - 1]) : typeFactory(value);
            }

            // Validate results
            const invalidMessage = await flag?.validate?.(result);

            if (invalidMessage && typeof invalidMessage === 'string') {
              throw createValidationError(invalidMessage);
            } else if (!invalidMessage && typeof invalidMessage === 'boolean') {
              throw createValidationError(`--${decamelize(key, { separator: '-' })} received invalid input.`);
            }

            return [key, result ?? (typeof flag.default === 'function' ? flag.default() : flag.default)];
          }

          // Return undefined if no flag is defined (we'll filter it out)
          return [key, undefined];
        }),
      ),
    ),
  );
}
