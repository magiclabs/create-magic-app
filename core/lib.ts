import { createApp, CreateMagicAppConfig } from './create-app';

/**
 * Generates boilerplate app code integrated with
 * passwordless login powered by Magic Labs.
 *
 * @see https://magic.link/
 */
export default async function makeMagic(options: CreateMagicAppConfig = {}) {
  const { projectName = 'my-app', template = 'hello-world', branch = 'master', data = {} } = options;
  await createApp({ projectName, template, branch, data });
}
