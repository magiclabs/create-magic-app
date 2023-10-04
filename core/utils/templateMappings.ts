import BaseScaffold from '../types/BaseScaffold';
import DedicatedScaffold, { flags as dedicatedFlags } from '../../scaffolds/nextjs-dedicated-wallet/newScaffold';
import FlowDedicatedScaffold, {
  flags as flowDedicatedFlags,
} from '../../scaffolds/nextjs-flow-dedicated-wallet/newScaffold';
import FlowUniversalScaffold, {
  flags as flowUniversalFlags,
} from '../../scaffolds/nextjs-flow-universal-wallet/newScaffold';
import SolanaDedicatedScaffold, {
  flags as solanaDedicatedFlags,
} from '../../scaffolds/nextjs-solana-dedicated-wallet/newScaffold';
import UniversalScaffold, { flags as universalFlags } from '../../scaffolds/nextjs-universal-wallet/newScaffold';
import { AuthTypePrompt, BlockchainNetworkPrompt, PublishableApiKeyPrompt } from 'scaffolds/prompts';
import { Ora, Spinner } from 'ora';
import { Timer } from './timer';

export type Chain = 'evm' | 'solana' | 'flow';
export type Template =
  | 'nextjs-dedicated-wallet'
  | 'nextjs-universal-wallet'
  | 'nextjs-solana-dedicated-wallet'
  | 'nextjs-flow-universal-wallet'
  | 'nextjs-flow-dedicated-wallet';

export type Product = 'universal' | 'dedicated';

export function mapTemplateToChain(template: string): Chain | undefined {
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

export function mapTemplateToProduct(template: string): Product | undefined {
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
