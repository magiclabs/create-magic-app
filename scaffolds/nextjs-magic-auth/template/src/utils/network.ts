const POLYGON = 'https://rpc-mumbai.maticvigil.com/';
const OPTIMISM = 'https://goerli.optimism.io/';
const ETHEREUM_GOERLI = 'https://eth-goerli.g.alchemy.com/v2/3jKhhva6zBqwp_dnwPlF4d0rFZhu2pjD/';

export const getChainIdFromUrl = () => {
  switch (process.env.NEXT_PUBLIC_BLOCKCHAIN_NETWORK_URL) {
    case OPTIMISM:
      return 420;
    case POLYGON:
      return 80001;
    case ETHEREUM_GOERLI:
      return 5;
  }
};

export const getNetworkTokenFromUrl = () => {
  switch (process.env.NEXT_PUBLIC_BLOCKCHAIN_NETWORK_URL) {
    case POLYGON:
      return 'MATIC';
    case OPTIMISM:
    case ETHEREUM_GOERLI:
      return 'ETH';
  }
};

export const getFaucetUrl = () => {
  switch (process.env.NEXT_PUBLIC_BLOCKCHAIN_NETWORK_URL) {
    case OPTIMISM:
      return 'https://community.optimism.io/docs/useful-tools/faucets/';
    case POLYGON:
      return 'https://faucet.polygon.technology/';
    case ETHEREUM_GOERLI:
      return 'https://goerlifaucet.com/';
  }
};

export const getNetworkName = () => {
  switch (process.env.NEXT_PUBLIC_BLOCKCHAIN_NETWORK_URL) {
    case OPTIMISM:
      return 'Optimism (Goerli)';
    case POLYGON:
      return 'Polygon (Mumbai)';
    case ETHEREUM_GOERLI:
      return 'Ethereum (Goerli)';
  }
};
