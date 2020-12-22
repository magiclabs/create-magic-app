/* eslint-disable consistent-return */

/**
 * The utilities in this file are based on the
 * `helpers/examples.ts` module from `create-next-app`.
 *
 * @see the `package.json#license` field at the root of this source tree:
 *   https://github.com/vercel/next.js/blob/master/packages/create-next-app/helpers/examples.ts
 */

import got from 'got';
import tar from 'tar';
import { Stream } from 'stream';
import { promisify } from 'util';
import { URL } from 'url';

const pipeline = promisify(Stream.pipeline);

interface RepoInfo {
  username: string;
  name: string;
  branch: string;
  filePath: string;
}

/**
 * Gets repository information for the given remote
 * `url` (must be a GitHub origin) and `examplePath`.
 */
export async function getRepoInfo(url: URL, examplePath?: string): Promise<RepoInfo | undefined> {
  const [, username, name, t, _branch, ...file] = url.pathname.split('/');
  const filePath = examplePath ? examplePath.replace(/^\//, '') : file.join('/');

  // Support repos whose entire purpose is to be a Magic example, e.g.
  // https://github.com/:username/:my-cool-magic-example-repo-name.
  if (t === undefined) {
    const infoResponse = await got(`https://api.github.com/repos/${username}/${name}`).catch((e) => e);
    if (infoResponse.statusCode !== 200) {
      return;
    }
    const info = JSON.parse(infoResponse.body);
    return { username, name, branch: info.default_branch, filePath };
  }

  // If examplePath is available, the branch name takes the entire path
  const branch = examplePath ? `${_branch}/${file.join('/')}`.replace(new RegExp(`/${filePath}|/$`), '') : _branch;

  if (username && name && branch && t === 'tree') {
    return { username, name, branch, filePath };
  }
}

/**
 * Downloads an archive of the template repository using the given `RepoInfo`.
 * The archive is extracted at the given `root`, which is expected to already
 * exist before calling this function.
 */
export function downloadAndExtractRepo(root: string, { username, name, branch, filePath }: RepoInfo): Promise<void> {
  return pipeline(
    got.stream(`https://codeload.github.com/${username}/${name}/tar.gz/${branch}`),
    tar.extract({ cwd: root, strip: filePath ? filePath.split('/').length + 1 : 1 }, [
      `${name}-${branch}${filePath ? `/${filePath}` : ''}`,
    ]),
  );
}
