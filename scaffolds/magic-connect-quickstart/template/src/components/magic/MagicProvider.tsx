import { createContext, useContext, useCallback, useEffect, useState } from 'react';
import { Magic } from 'magic-sdk';
import Web3 from 'web3';

export type MagicContextType = {
  magic: Magic | null;
  web3: Web3 | null;
  updateMagicInstance: () => void;
};

const MagicContext = createContext<MagicContextType>({
  magic: null,
  web3: null,
  updateMagicInstance: () => {},
});

export const useMagicContext = () => useContext(MagicContext);

const MagicProvider = ({ children }: { children: React.ReactNode }) => {
  const [magicInstance, setMagicInstance] = useState<Magic | null>(null);
  const [web3Instance, setWeb3Instance] = useState<Web3 | null>(null);

  const updateMagicInstance = useCallback(() => {
    const magic = new Magic(process.env.NEXT_PUBLIC_MAGIC_API_KEY as string, {
      network: {
        rpcUrl: process.env.NEXT_PUBLIC_POLYGON_RPC_URL as string,
        chainId: 80001,
      },
    });
    setMagicInstance(magic);
    setWeb3Instance(new Web3((magic as any).rpcProvider));
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      updateMagicInstance();
    }
  }, [updateMagicInstance]);

  return (
    <MagicContext.Provider
      value={{
        magic: magicInstance,
        web3: web3Instance,
        updateMagicInstance,
      }}
    >
      {children}
    </MagicContext.Provider>
  );
};

export default MagicProvider;
