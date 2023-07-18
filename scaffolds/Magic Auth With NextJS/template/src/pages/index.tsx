import { Network, NetworkOption, getFormattedNetwork } from '@/utils/network';
import Header from '../components/Header';
import MagicProvider, { useMagic } from '../components/provider/MagicProvider';
import Image from 'next/image';
import React, { lazy, useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { authMethods } from '@/utils/authMapper';
import dynamic from 'next/dynamic';

export default function Home() {
  const [token, setToken] = useState('');

  const [selectedNetwork, setSelectedNetwork] = useState<NetworkOption | null>(
    getFormattedNetwork(Network.POLY_TESTNET),
  );

  useEffect(() => {
    setToken(localStorage.getItem('token') ?? '');
  }, [setToken]);

  return (
    <MagicProvider network={selectedNetwork}>
      <ToastContainer />
      <Header
        selectedNetwork={selectedNetwork}
        setSelectedNetwork={setSelectedNetwork}
        token={token}
        setToken={setToken}
      />
      <div className="flex min-h-screen flex-col items-center">
        <div className="w-[100%] grid grid-cols-6 gap-2 p-4">
          {authMethods.map((method) =>
            React.createElement(
              dynamic(() => import('../components/auth/' + method.replaceAll(' ', '')), { ssr: false }),
              {
                token,
                setToken,
              },
            ),
          )}
        </div>
      </div>
    </MagicProvider>
  );
}
