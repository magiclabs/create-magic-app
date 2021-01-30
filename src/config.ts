import path from 'path';
import pkgUp from 'pkg-up';

export const REPO_ROOT = path.dirname(pkgUp.sync()!);
export const GITHUB_BASE_URL = 'https://github.com';
export const DEFAULT_CREATE_MAGIC_APP_REPO = 'magiclabs/create-magic-app';
export const BINARY = 'make-magic';
