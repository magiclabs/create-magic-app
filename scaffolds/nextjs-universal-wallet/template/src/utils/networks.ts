export enum Network {
  POLYGON_AMOY = 'polygon-amoy',
  POLYGON = 'polygon',
  ETHEREUM_SEPOLIA = 'ethereum-sepolia',
  ETHEREUM = 'ethereum',
}

export const getNetworkUrl = () => {
  switch (process.env.NEXT_PUBLIC_BLOCKCHAIN_NETWORK) {
    case Network.POLYGON:
      return 'https://polygon-rpc.com/';
    case Network.POLYGON_AMOY:
      return 'https://rpc-amoy.polygon.technology/';
    case Network.ETHEREUM_SEPOLIA:
      return 'https://eth-sepolia.g.alchemy.com/v2/3jKhhva6zBqwp_dnwPlF4d0rFZhu2pjD';
    case Network.ETHEREUM:
      return 'https://eth-mainnet.g.alchemy.com/v2/3jKhhva6zBqwp_dnwPlF4d0rFZhu2pjD';
    default:
      throw new Error('Network not supported');
  }
};

export const getChainId = () => {
  switch (process.env.NEXT_PUBLIC_BLOCKCHAIN_NETWORK) {
    case Network.POLYGON:
      return 137;
    case Network.POLYGON_AMOY:
      return 80001;
    case Network.ETHEREUM_SEPOLIA:
      return 1155111;
    case Network.ETHEREUM:
      return 1;
  }
};

export const getNetworkToken = () => {
  switch (process.env.NEXT_PUBLIC_BLOCKCHAIN_NETWORK) {
    case Network.POLYGON_AMOY:
    case Network.POLYGON:
      return 'MATIC';
    case Network.ETHEREUM:
    case Network.ETHEREUM_SEPOLIA:
      return 'ETH';
  }
};

export const getFaucetUrl = () => {
  switch (process.env.NEXT_PUBLIC_BLOCKCHAIN_NETWORK) {
    case Network.POLYGON_AMOY:
      return 'https://faucet.polygon.technology/';
    case Network.ETHEREUM_SEPOLIA:
      return 'https://sepoliafaucet.com/';
  }
};

export const getNetworkName = () => {
  switch (process.env.NEXT_PUBLIC_BLOCKCHAIN_NETWORK) {
    case Network.POLYGON:
      return 'Polygon (Mainnet)';
    case Network.POLYGON_AMOY:
      return 'Polygon (Mumbai)';
    case Network.ETHEREUM_SEPOLIA:
      return 'Ethereum (Sepolia)';
    case Network.ETHEREUM:
      return 'Ethereum (Mainnet)';
  }
};

export const getBlockExplorer = (address: string) => {
  switch (process.env.NEXT_PUBLIC_BLOCKCHAIN_NETWORK) {
    case Network.POLYGON:
      return `https://polygonscan.com/address/${address}`;
    case Network.POLYGON_AMOY:
      return `https://www.oklink.com/amoy/address/${address}`;
    case Network.ETHEREUM:
      return `https://etherscan.io/address/${address}`;
    case Network.ETHEREUM_SEPOLIA:
      return `https://sepolia.etherscan.io/address/${address}`;
  }
};
