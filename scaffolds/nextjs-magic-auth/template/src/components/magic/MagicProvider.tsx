import { getChainIdFromUrl } from '@/utils/network';
import { OAuthExtension } from '@magic-ext/oauth';
import { AuthExtension } from '@magic-ext/auth';
import { Magic as MagicBase } from 'magic-sdk';
import { ReactNode, createContext, useContext, useEffect, useMemo, useState } from 'react';
import Web3 from 'web3';

export type Magic = MagicBase<AuthExtension & OAuthExtension[]>;

type MagicContextType = {
  magic: Magic | null;
  web3: Web3 | null;
};

const MagicContext = createContext<MagicContextType>({
  magic: null,
  web3: null,
});

export const useMagic = () => useContext(MagicContext);

const MagicProvider = ({ children }: { children: ReactNode }) => {
  const [magic, setMagic] = useState<Magic | null>(null);
  const [web3, setWeb3] = useState<Web3 | null>(null);

  useEffect(() => {
    const magic = new MagicBase(process.env.NEXT_PUBLIC_MAGIC_API_KEY!, {
      network: {
        rpcUrl: process.env.NEXT_PUBLIC_BLOCKCHAIN_NETWORK_URL!,
        chainId: getChainIdFromUrl(),
      },
      extensions: [new AuthExtension(), new OAuthExtension()],
    });
    const web3 = new Web3(magic.rpcProvider);
    setMagic(magic);
    setWeb3(web3);
  }, []);

  const value = useMemo(() => {
    return {
      magic,
      web3,
    };
  }, [magic, web3]);

  return <MagicContext.Provider value={value}>{children}</MagicContext.Provider>;
};

export default MagicProvider;
