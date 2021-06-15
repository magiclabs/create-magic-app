import { createApp, CreateMagicAppConfig } from './create-app';

export default async function makeMagic(options: CreateMagicAppConfig = {}) {
  const { projectName = 'my-app', template = 'hello-world', branch = 'master', data = {} } = options;
  await createApp({ projectName, template, branch, data });
}

makeMagic({ projectName: 'my-app', template: 'hello-world', branch: 'master' });
