import path from 'path';

// Relative to `/dist`, so we are actually walking up an additional directory.
export const REPO_ROOT = path.resolve(__dirname, '../../');

export const GITHUB_BASE_URL = 'https://github.com';
export const DEFAULT_CREATE_MAGIC_APP_REPO = 'magiclabs/create-magic-app';
export const BINARY = 'make-magic';
