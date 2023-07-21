export const getChainIdFromUrl = (url: string) => {
  switch (url) {
    case 'https://polygon-rpc.com/':
      return 137;
    case 'https://rpc-mumbai.maticvigil.com':
      return 80001;
    case 'https://eth-goerli.g.alchemy.com/v2/fYFybLQFR9Zr2GCRcgALmAktStFKr0i0':
      return 5;
  }
};

export const getTokenSymbol = () => {
  if (
    process.env.NEXT_PUBLIC_BLOCKCHAIN_NETWORK_URL == 'https://polygon-rpc.com/' ||
    process.env.NEXT_PUBLIC_BLOCKCHAIN_NETWORK_URL == 'https://rpc-mumbai.maticvigil.com'
  ) {
    return 'Matic';
  } else if (
    process.env.NEXT_PUBLIC_BLOCKCHAIN_NETWORK_URL ==
    'https://eth-goerli.g.alchemy.com/v2/fYFybLQFR9Zr2GCRcgALmAktStFKr0i0'
  ) {
    return 'Eth';
  }
  return '';
};

export const getFaucetUrl = () => {
  if (
    process.env.NEXT_PUBLIC_BLOCKCHAIN_NETWORK_URL == 'https://polygon-rpc.com/' ||
    process.env.NEXT_PUBLIC_BLOCKCHAIN_NETWORK_URL == 'https://rpc-mumbai.maticvigil.com'
  ) {
    return 'https://faucet.polygon.technology/';
  } else if (
    process.env.NEXT_PUBLIC_BLOCKCHAIN_NETWORK_URL ==
    'https://eth-goerli.g.alchemy.com/v2/fYFybLQFR9Zr2GCRcgALmAktStFKr0i0'
  ) {
    return 'https://goerlifaucet.com/';
  }
  return '';
};
