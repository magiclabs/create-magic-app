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
export type Flag<T extends ValueType = ValueType> = {
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
};

/**
 * A record of `ScaffoldFlag` values with data types given by `T`.
 */
export type Flags<T extends Record<string, ValueType> = Record<string, any>> = {
  [P in keyof T]: Flag<T[P]>;
};

type TypedFlag<F extends Flag> = F extends Flag<infer R> ? R : unknown;

export type TypedFlags<F extends Flags> = {
  [P in keyof F]: TypedFlag<F[P]> | undefined;
};

/**
 * Parse and validate input given by the user via CLI flags.
 */
export async function parseFlags<T extends Flags>(flags: T): Promise<TypedFlags<T>> {
  const aliases: Record<string, string[]> = {};
  const booleans: string[] = [];

  (Object.entries(flags) as Array<[string, Flag]>).forEach(([flag, options]) => {
    if (options.alias) {
      aliases[flag] = [options.alias];
    }

    if (options.type === Boolean) {
      booleans.push(flag);
    }
  });

  const results: any = parseArgs(process.argv.slice(2), {
    alias: aliases,
    boolean: booleans,
  });

  const finalResults = filterNilValues<TypedFlags<T>>(
    Object.fromEntries(
      await Promise.all(
        Object.entries(results).map(async ([key, value]) => {
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

            return [key, result];
          }

          // Return undefined if no flag is defined (we'll filter it out)
          return [key, undefined];
        }),
      ),
    ),
  );

  return finalResults;
}
