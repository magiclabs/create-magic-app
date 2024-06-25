import { Web3 } from 'web3';
import { useEffect, useState } from 'react';
import { useMagic } from './MagicProvider';

const useWeb3 = () => {
  const { magic } = useMagic();
  const [web3, setWeb3] = useState<Web3 | null>(null);

  useEffect(() => {
    if (magic) {
      setWeb3(new Web3((magic as any).rpcProvider));
    } else {
      console.log('Magic is not initialized');
    }
  }, [magic]);

  return web3;
};

export default useWeb3;