/**
 * Returns a shallow copy of `obj` without `null` or `undefined` values.
 */
export function filterNilValues<T>(obj: Partial<T>): T {
  const result: any = {};

  for (const [prop, value] of Object.entries(obj)) {
    if (value != null) {
      result[prop] = value;
    }
  }

  return result;
}
