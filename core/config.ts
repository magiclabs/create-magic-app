import path from 'path';
import os from 'os';
import fs from 'fs';

// Relative to `/dist`, so we are actually walking up an additional directory.
export const REPO_ROOT = path.resolve(__dirname, '../../');

export const GITHUB_BASE_URL = 'https://github.com';
export const DEFAULT_CREATE_MAGIC_APP_REPO = 'unboxed-software/create-magic-app';
export const BINARY = 'make-magic';

export interface CliConfig {
  shouldTrackUsageData: boolean;
  id: string;
}

let configCache: Partial<CliConfig> | undefined;

export const saveConfig = (config: Partial<CliConfig>) => {
  try {
    configCache = config;
    const homedir = os.homedir();
    const configDir = path.resolve(homedir, '.make-magic');
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir);
    }
    const configUrl = path.resolve(homedir, '.make-magic/config');
    const configString = JSON.stringify(config);
    fs.writeFileSync(configUrl, configString);
  } catch (err) {}
};

export const loadConfig = (): Partial<CliConfig> | undefined => {
  try {
    if (configCache) return configCache;

    const homedir = os.homedir();
    const configUrl = path.resolve(homedir, '.make-magic/config');
    const configString = fs.readFileSync(configUrl, 'utf8');
    const config = JSON.parse(configString);
    configCache = config;
    return config;
  } catch (err) {
    return undefined;
  }
};
