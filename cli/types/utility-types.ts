/**
 * Get a union of value types from `T`.
 */
export type ValuesOf<T> = T extends ReadonlyArray<any> ? T[number] : T[keyof T];
