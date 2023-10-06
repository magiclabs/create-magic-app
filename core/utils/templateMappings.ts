import BaseScaffold from '../types/BaseScaffold';
import DedicatedScaffold, { flags as dedicatedFlags } from '../../scaffolds/nextjs-dedicated-wallet/scaffold';
import FlowDedicatedScaffold, {
  flags as flowDedicatedFlags,
} from '../../scaffolds/nextjs-flow-dedicated-wallet/scaffold';
import FlowUniversalScaffold, {
  flags as flowUniversalFlags,
} from '../../scaffolds/nextjs-flow-universal-wallet/scaffold';
import SolanaDedicatedScaffold, {
  flags as solanaDedicatedFlags,
} from '../../scaffolds/nextjs-solana-dedicated-wallet/scaffold';
import UniversalScaffold, { flags as universalFlags } from '../../scaffolds/nextjs-universal-wallet/scaffold';
import {
  AuthTypePrompt,
  BlockchainNetworkPrompt,
  ConfigurationPrompt,
  ProductPrompt,
  ProjectNamePrompt,
  PublishableApiKeyPrompt,
} from 'scaffolds/prompts';
import { Ora, Spinner } from 'ora';
import { Timer } from './timer';
import { CreateMagicAppConfig } from 'core/create-app';

export type Chain = 'evm' | 'solana' | 'flow';
export type Template =
  | 'nextjs-dedicated-wallet'
  | 'nextjs-universal-wallet'
  | 'nextjs-solana-dedicated-wallet'
  | 'nextjs-flow-universal-wallet'
  | 'nextjs-flow-dedicated-wallet';

export type Product = 'universal' | 'dedicated';
type ConfigType = CreateMagicAppConfig & {
  chain: Chain | undefined;
  product: Product | undefined;
  configuration: string | undefined;
  isChosenTemplateValid: boolean;
};

function mapTemplateToChain(template: string): Chain | undefined {
  switch (template) {
    case 'nextjs-dedicated-wallet':
    case 'nextjs-universal-wallet':
      return 'evm';
    case 'nextjs-solana-dedicated-wallet':
      return 'solana';
    case 'nextjs-flow-universal-wallet':
    case 'nextjs-flow-dedicated-wallet':
      return 'flow';
    default:
      return undefined;
  }
}

function mapTemplateToProduct(template: string): Product | undefined {
  switch (template) {
    case 'nextjs-dedicated-wallet':
    case 'nextjs-solana-dedicated-wallet':
    case 'nextjs-flow-dedicated-wallet':
      return 'dedicated';
    case 'nextjs-universal-wallet':
    case 'nextjs-flow-universal-wallet':
      return 'universal';
    default:
      return undefined;
  }
}

export async function mapTemplateToScaffold(
  template: string,
  data: any,
  spinner: Ora,
  timer: Timer,
): Promise<BaseScaffold> {
  if (spinner.isSpinning) {
    spinner.stop();
    timer.pause();
  }
  if (!data.publishableApiKey) {
    data.publishableApiKey = await PublishableApiKeyPrompt.publishableApiKeyPrompt();
  }
  switch (template) {
    case 'nextjs-dedicated-wallet':
      if (!data.network) {
        data.network = await BlockchainNetworkPrompt.evmNetworkPrompt();
      }
      if (!data.loginMethods || data.loginMethods.length === 0) {
        data.loginMethods = await AuthTypePrompt.loginMethodsPrompt();
      }
      return new DedicatedScaffold(data);
    case 'nextjs-universal-wallet':
      if (!data.network) {
        data.network = await BlockchainNetworkPrompt.evmNetworkPrompt();
      }
      return new UniversalScaffold(data);
    case 'nextjs-solana-dedicated-wallet':
      if (!data.network) {
        data.network = await BlockchainNetworkPrompt.solanaNetworkPrompt();
      }
      if (!data.loginMethods || data.loginMethods.length === 0) {
        data.loginMethods = await AuthTypePrompt.loginMethodsPrompt();
      }
      return new SolanaDedicatedScaffold(data);
    case 'nextjs-flow-universal-wallet':
      if (!data.network) {
        data.network = await BlockchainNetworkPrompt.flowNetworkPrompt();
      }
      return new FlowUniversalScaffold(data);
    case 'nextjs-flow-dedicated-wallet':
      if (!data.network) {
        data.network = await BlockchainNetworkPrompt.flowNetworkPrompt();
      }
      if (!data.loginMethods || data.loginMethods.length === 0) {
        data.loginMethods = await AuthTypePrompt.loginMethodsPrompt();
      }
      return new FlowDedicatedScaffold(data);
    default:
      throw new Error(`Invalid template: ${template}`);
  }
}

export function mapTemplateToFlags(template: string): any {
  switch (template) {
    case 'nextjs-dedicated-wallet':
      return dedicatedFlags;
    case 'nextjs-universal-wallet':
      return universalFlags;
    case 'nextjs-solana-dedicated-wallet':
      return solanaDedicatedFlags;
    case 'nextjs-flow-universal-wallet':
      return flowUniversalFlags;
    case 'nextjs-flow-dedicated-wallet':
      return flowDedicatedFlags;
    default:
      throw new Error(`Invalid template: ${template}`);
  }
}

const quickstartConfig = (config: ConfigType): ConfigType => ({
  ...config,
  template: 'nextjs-dedicated-wallet',
  network: 'polygon-mumbai',
  product: 'dedicated',
  chain: 'evm',
  isChosenTemplateValid: true,
});

const solanaConfig = async (config: ConfigType): Promise<ConfigType> => ({
  ...config,
  template: 'nextjs-solana-dedicated-wallet',
  network: await BlockchainNetworkPrompt.solanaNetworkPrompt(),
  product: 'dedicated',
  chain: 'solana',
  isChosenTemplateValid: true,
});

export const buildTemplate = async (config: ConfigType): Promise<ConfigType> => {
  if (!config.projectName) {
    config.projectName = await ProjectNamePrompt.askProjectName();
  }

  if (!config.template) {
    config.configuration = await ConfigurationPrompt.askConfiguration();

    if (config.configuration === 'quickstart') {
      config = quickstartConfig(config);
    }
  } else {
    config = {
      ...config,
      product: mapTemplateToProduct(config.template),
      chain: mapTemplateToChain(config.template),
    };
  }

  if (!config.chain && !config.network) {
    config.chain = await BlockchainNetworkPrompt.chainPrompt();
  }

  if (!config.network) {
    if (config.chain === 'solana') {
      config = await solanaConfig(config);
    } else if (config.chain === 'flow') {
      config.network = await BlockchainNetworkPrompt.flowNetworkPrompt();
    } else if (config.chain === 'evm') {
      config.network = await BlockchainNetworkPrompt.evmNetworkPrompt();
    }
  } else {
    if (
      config.network == 'ethereum' ||
      config.network == 'ethereum-goerli' ||
      config.network == 'polygon' ||
      config.network == 'polygon-mumbai'
    ) {
      config.chain = 'evm';
    } else if (config.network == 'solana-denvet' || config.network == 'solana-mainnet') {
      config.chain = 'solana';
    } else {
      config.chain = 'flow';
    }
  }

  if (!config.product) {
    config.product = await ProductPrompt.askProduct();

    if (config.product === 'universal') {
      if (config.chain === 'flow') {
        config.template = 'nextjs-flow-universal-wallet';
      } else {
        config.template = 'nextjs-universal-wallet';
      }
    } else if (config.chain === 'flow') {
      config.template = 'nextjs-flow-dedicated-wallet';
    } else {
      config.template = 'nextjs-dedicated-wallet';
    }
    config.isChosenTemplateValid = true;
  }

  return config;
};
