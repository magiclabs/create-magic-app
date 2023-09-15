/* eslint-disable @typescript-eslint/no-var-requires */

import crypto from 'crypto';
import { loadConfig, saveConfig } from '../config';

export const initializeUsageConfigIfneeded = async (): Promise<boolean> => {
  let config = await loadConfig();

  if (!config) {
    config = { shouldTrackUsageData: true };
    await saveConfig(config);
  }

  if ((config.shouldTrackUsageData ?? false) && !config.id) {
    config.id = crypto.randomUUID();
    await saveConfig(config);
  }

  return config.shouldTrackUsageData ?? false;
};

export const modifyUsageConsent = async (shouldTrackUsageData: boolean) => {
  let config = await loadConfig();
  config = { ...config, shouldTrackUsageData };
  await saveConfig(config);
  return config?.shouldTrackUsageData ?? false;
};
