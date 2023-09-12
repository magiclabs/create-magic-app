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
