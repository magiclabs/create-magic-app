export enum Network {
  FLOW_MAINNET = 'flow-mainnet',
  FLOW_TESTNET = 'flow-testnet',
}

export const getNetworkUrl = () => {
  switch (process.env.NEXT_PUBLIC_BLOCKCHAIN_NETWORK) {
    case Network.FLOW_MAINNET:
      return 'https://rest-mainnet.onflow.org';
    case Network.FLOW_TESTNET:
      return 'https://rest-testnet.onflow.org';
    default:
      throw new Error('Network not supported');
  }
};

export const getNetwork = () => {
  switch (process.env.NEXT_PUBLIC_BLOCKCHAIN_NETWORK) {
    case Network.FLOW_MAINNET:
      return 'mainnet';
    case Network.FLOW_TESTNET:
      return 'testnet';
  }
};

export const getFaucetUrl = () => {
  switch (process.env.NEXT_PUBLIC_BLOCKCHAIN_NETWORK) {
    case Network.FLOW_TESTNET:
      return 'https://testnet-faucet.onflow.org/fund-account/';
  }
};

export const getNetworkName = () => {
  switch (process.env.NEXT_PUBLIC_BLOCKCHAIN_NETWORK) {
    case Network.FLOW_MAINNET:
      return 'Flow (Mainnet)';
    case Network.FLOW_TESTNET:
      return 'Flow (Testnet)';
  }
};

export const getBlockExplorer = (address: string) => {
  switch (process.env.NEXT_PUBLIC_BLOCKCHAIN_NETWORK) {
    case Network.FLOW_MAINNET:
      return `https://flowscan.org/account/${address}`;
    case Network.FLOW_TESTNET:
      return `https://testnet.flowscan.org/account/${address}`;
  }
};
