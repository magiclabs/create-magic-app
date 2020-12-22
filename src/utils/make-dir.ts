import fs from 'fs';

/**
 * Creates a directory recursively use NodeJS `fs` promises.
 *
 * Based on the `helpers/make-dir.ts` utility from `create-next-app`.
 *
 * @see the `package.json#license` field at the root of this source tree:
 *   https://github.com/vercel/next.js/blob/master/packages/create-next-app/helpers/make-dir.ts
 */
export async function makeDir(root: string, options = { recursive: true }): Promise<void> {
  await fs.promises.mkdir(root, options);
}
