import { loadConfig, saveConfig } from '../config';
import crypto from 'crypto';
const { Select } = require('enquirer');

export const promptForUsageDataIfNeeded = async (): Promise<boolean> => {
  let config = await loadConfig();

  if (!config) {
    const answer = await promptForUsageData();
    config = { shouldTrackUsageData: answer };
    await saveConfig(config);
  }

  if ((config.shouldTrackUsageData ?? false) && !config.id) {
    config.id = crypto.randomUUID();
    await saveConfig(config);
  }

  return config.shouldTrackUsageData ?? false;
};

const promptForUsageData = async (): Promise<boolean> => {
  const answer = await new Select({
    name: 'analytics',
    message: 'Would you like to help us improve this tool by allowing us to collect anonymous usage data?',
    choices: [{ name: 'Yes' }, { name: 'No' }],
  }).run();

  return answer === 'Yes' ? true : false;
};
