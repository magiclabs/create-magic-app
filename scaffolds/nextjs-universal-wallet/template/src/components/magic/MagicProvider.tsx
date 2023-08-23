import { createContext, useContext, useEffect, useState } from 'react';
import { Magic } from 'magic-sdk';
import { getChainId, getNetworkUrl } from '../../utils/networks';
import Web3 from 'web3';

export type MagicContextType = {
  magic: Magic | null;
  web3: Web3 | null;
};

const MagicContext = createContext<MagicContextType>({
  magic: null,
  web3: null,
});

export const useMagicContext = () => useContext(MagicContext);

const MagicProvider = ({ children }: { children: React.ReactNode }) => {
  const [magicInstance, setMagicInstance] = useState<Magic | null>(null);
  const [web3Instance, setWeb3Instance] = useState<Web3 | null>(null);

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_MAGIC_API_KEY) {
      const magic = new Magic(process.env.NEXT_PUBLIC_MAGIC_API_KEY as string, {
        network: {
          rpcUrl: getNetworkUrl(),
          chainId: getChainId(),
        },
      });

      setMagicInstance(magic);
      setWeb3Instance(new Web3((magic as any).rpcProvider));
    }
  }, []);

  return (
    <MagicContext.Provider
      value={{
        magic: magicInstance,
        web3: web3Instance,
      }}
    >
      {children}
    </MagicContext.Provider>
  );
};

export default MagicProvider;
