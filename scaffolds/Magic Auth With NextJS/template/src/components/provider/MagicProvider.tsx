import { Network, NetworkOption, getChainIdFromUrl, getFormattedNetwork } from '@/utils/network';
import { OAuthExtension } from '@magic-ext/oauth';
import { Magic } from 'magic-sdk';
import { ReactNode, createContext, useContext, useEffect, useMemo, useState } from 'react';
import Web3 from 'web3';

type MagicContextType = {
  network: NetworkOption | null;
  magic: Magic | null;
  web3: Web3 | null;
};

const MagicContext = createContext<MagicContextType>({
  network: null,
  magic: null,
  web3: null,
});

export const useMagic = () => useContext(MagicContext);

const MagicProvider = ({ children, network: networkProp }: { children: ReactNode; network: NetworkOption | null }) => {
  const [network, setNetwork] = useState<NetworkOption | null>(networkProp);
  const [magic, setMagic] = useState<Magic | null>(null);
  const [web3, setWeb3] = useState<Web3 | null>(null);

  useEffect(() => {
    let currentNetwork: NetworkOption;
    if (network == null) {
      currentNetwork = getFormattedNetwork(Network.POLY_TESTNET);
    } else {
      currentNetwork = { ...networkProp! };
    }

    console.log('blockchain url from scaffold: ' + process.env.NEXT_PUBLIC_BLOCKCHAIN_NETWORK_URL);
    const magic = new Magic(process.env.NEXT_PUBLIC_MAGIC_API_KEY!, {
      network: {
        rpcUrl: process.env.NEXT_PUBLIC_BLOCKCHAIN_NETWORK_URL,
        chainId: getChainIdFromUrl(process.env.NEXT_PUBLIC_BLOCKCHAIN_NETWORK_URL!),
      },
      extensions: [new OAuthExtension()],
    });
    const web3 = new Web3(magic.rpcProvider);
    setNetwork(network);
    setMagic(magic);
    setWeb3(web3);
  }, [networkProp, network]);

  const value = useMemo(() => {
    return {
      magic,
      network,
      web3,
    };
  }, [magic, network]);

  return <MagicContext.Provider value={value}>{children}</MagicContext.Provider>;
};

export default MagicProvider;
