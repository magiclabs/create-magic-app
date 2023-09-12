export enum Network {
  SOLANA_DENVET = 'solana-devnet',
  SOLANA_MAINNET_BETA = 'solana-mainnet',
}

export const getNetworkUrl = () => {
  switch (process.env.NEXT_PUBLIC_BLOCKCHAIN_NETWORK) {
    case Network.SOLANA_DENVET:
      return 'https://solana-devnet.g.alchemy.com/v2/NUZZICdM-417xyZwDhka3615uai5GQFr';
    case Network.SOLANA_MAINNET_BETA:
      return 'https://solana-mainnet.g.alchemy.com/v2/9nCoa06gjvDwYyTdV5ruBp2Qe4_wZnaO';
    default:
      throw new Error('Network not supported');
  }
};

export const getNetworkName = () => {
  switch (process.env.NEXT_PUBLIC_BLOCKCHAIN_NETWORK) {
    case Network.SOLANA_DENVET:
      return 'Solana (Devnet)';
    case Network.SOLANA_MAINNET_BETA:
      return 'Solana (Mainnet Beta)';
  }
};

export const getBlockExplorer = (address: string) => {
  switch (process.env.NEXT_PUBLIC_BLOCKCHAIN_NETWORK) {
    case Network.SOLANA_DENVET:
      return `https://explorer.solana.com/address/${address}?cluster=devnet`;
    case Network.SOLANA_MAINNET_BETA:
      return `https://explorer.solana.com/address/${address}`;
  }
};
