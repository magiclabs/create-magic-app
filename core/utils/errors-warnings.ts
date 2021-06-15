import chalk from 'compiled/chalk';

/**
 * Enum of possible error codes associated
 * with `CreateMagicAppError` instances.
 */
export enum CreateMagicAppErrorCode {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
}

/**
 * Base class representing `make-magic` errors.
 */
export class CreateMagicAppError<Code extends CreateMagicAppErrorCode = CreateMagicAppErrorCode> extends Error {
  constructor(public readonly code: Code, message?: string) {
    super(chalk`{red Error:} ${message}`);
  }
}

/**
 * Prints a prefixed warning to the console.
 */
export function printWarning(message?: string) {
  console.warn(chalk`{yellow Warning:} ${message}`);
}

/**
 * Creates a validation error
 */
export function createValidationError(message?: string) {
  return new CreateMagicAppError(CreateMagicAppErrorCode.VALIDATION_ERROR, message);
}
