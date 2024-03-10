export enum Network {
  POLYGON_AMOY = 'polygon-amoy',
  POLYGON = 'polygon',
  ETHEREUM_SEPOLIA = 'ethereum-sepolia',
  ETHEREUM = 'ethereum',
  ZKSYNC = 'zksync',
  ZKSYNC_SEPOLIA = 'zksync-sepolia',
}

export const getNetworkUrl = () => {
  switch (process.env.NEXT_PUBLIC_BLOCKCHAIN_NETWORK) {
    case Network.POLYGON:
      return 'https://polygon-rpc.com/';
    case Network.POLYGON_AMOY:
      return 'https://rpc-amoy.polygon.technology/';
    case Network.ETHEREUM_SEPOLIA:
      return 'https://eth-sepolia.g.alchemy.com/v2/fYFybLQFR9Zr2GCRcgALmAktStFKr0i0';
    case Network.ETHEREUM:
      return 'https://eth-mainnet.g.alchemy.com/v2/fYFybLQFR9Zr2GCRcgALmAktStFKr0i0';
    case Network.ZKSYNC:
      return 'https://mainnet.era.zksync.io';
    case Network.ZKSYNC_SEPOLIA:
      return 'https://sepolia.era.zksync.dev';
    default:
      throw new Error('Network not supported');
  }
};

export const getChainId = () => {
  switch (process.env.NEXT_PUBLIC_BLOCKCHAIN_NETWORK) {
    case Network.POLYGON:
      return 137;
    case Network.POLYGON_AMOY:
      return 80002;
    case Network.ETHEREUM_SEPOLIA:
      return 11155111;
    case Network.ZKSYNC:
      return 324;
    case Network.ZKSYNC_SEPOLIA:
      return 300;
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
    case Network.ZKSYNC:
    case Network.ZKSYNC_SEPOLIA:
      return 'ETH';
  }
};

export const getFaucetUrl = () => {
  switch (process.env.NEXT_PUBLIC_BLOCKCHAIN_NETWORK) {
    case Network.POLYGON_AMOY:
      return 'https://faucet.polygon.technology/';
    case Network.ETHEREUM_SEPOLIA:
      return 'https://sepoliafaucet.com/';
    case Network.ZKSYNC_SEPOLIA:
      return 'https://faucet.quicknode.com/ethereum/sepolia'
  }
};

export const getNetworkName = () => {
  switch (process.env.NEXT_PUBLIC_BLOCKCHAIN_NETWORK) {
    case Network.POLYGON:
      return 'Polygon (Mainnet)';
    case Network.POLYGON_AMOY:
      return 'Polygon (Amoy)';
    case Network.ETHEREUM_SEPOLIA:
      return 'Ethereum (Sepolia)';
    case Network.ETHEREUM:
      return 'Ethereum (Mainnet)';
    case Network.ZKSYNC:
      return 'Zksync (Mainnet)';
    case Network.ZKSYNC_SEPOLIA:
      return 'Zksync (Sepolia)';
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
    case Network.ZKSYNC:
      return `https://explorer.zksync.io/address/${address}`;
    case Network.ZKSYNC_SEPOLIA:
      return `https://sepolia.explorer.zksync.io/address/${address}`;
  }
};
