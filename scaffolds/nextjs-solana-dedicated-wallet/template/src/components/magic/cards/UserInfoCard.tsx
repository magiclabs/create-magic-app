import { useCallback, useEffect, useState } from 'react';
import Divider from '@/components/ui/Divider';
import { LoginProps } from '@/utils/types';
import { logout } from '@/utils/common';
import { useMagic } from '../MagicProvider';
import Card from '@/components/ui/Card';
import CardHeader from '@/components/ui/CardHeader';
import CardLabel from '@/components/ui/CardLabel';
import Spinner from '@/components/ui/Spinner';
import { getNetworkName } from '@/utils/network';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';

const UserInfo = ({ token, setToken }: LoginProps) => {
  const { magic, connection } = useMagic();

  const [balance, setBalance] = useState('...');
  const [copied, setCopied] = useState('Copy');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [publicAddress, setPublicAddress] = useState(localStorage.getItem('user'));

  useEffect(() => {
    const checkLoginandGetBalance = async () => {
      const isLoggedIn = await magic?.user.isLoggedIn();
      if (isLoggedIn) {
        try {
          const metadata = await magic?.user.getInfo();
          if (metadata) {
            localStorage.setItem('user', metadata?.publicAddress!);
            setPublicAddress(metadata?.publicAddress!);
          }
        } catch (e) {
          console.log('error in fetching address: ' + e);
        }
      }
    };
    setTimeout(() => checkLoginandGetBalance(), 5000);
  }, []);

  const getBalance = useCallback(async () => {
    if (publicAddress && connection) {
      const balance = await connection.getBalance(new PublicKey(publicAddress));
      if (balance == 0) {
        setBalance('0');
      } else {
        setBalance((balance / LAMPORTS_PER_SOL).toString());
      }
      console.log('BALANCE: ', balance);
    }
  }, [connection, publicAddress]);

  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    await getBalance();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 500);
  }, [getBalance]);

  useEffect(() => {
    if (connection) {
      refresh();
    }
  }, [connection, refresh]);

  useEffect(() => {
    setBalance('...');
  }, [magic]);

  const disconnect = useCallback(async () => {
    if (magic) {
      await logout(setToken, magic);
    }
  }, [magic, setToken]);

  const copy = useCallback(() => {
    if (publicAddress && copied === 'Copy') {
      setCopied('Copied!');
      navigator.clipboard.writeText(publicAddress);
      setTimeout(() => {
        setCopied('Copy');
      }, 1000);
    }
  }, [copied, publicAddress]);

  return (
    <Card>
      <CardHeader id="Wallet">Wallet</CardHeader>
      <CardLabel leftHeader="Status" rightAction={<div onClick={disconnect}>Disconnect</div>} isDisconnect />
      <div className="flex-row">
        <div className="green-dot" />
        <div className="connected">Connected to {getNetworkName()}</div>
      </div>
      <Divider />
      <CardLabel leftHeader="Address" rightAction={!publicAddress ? <Spinner /> : <div onClick={copy}>{copied}</div>} />
      <div className="code">{publicAddress?.length == 0 ? 'Fetching address..' : publicAddress}</div>
      <Divider />
      <CardLabel
        leftHeader="Balance"
        rightAction={
          isRefreshing ? (
            <div className="loading-container">
              <Spinner />
            </div>
          ) : (
            <div onClick={refresh}>Refresh</div>
          )
        }
      />
      <div className="code">{balance} SOL</div>
    </Card>
  );
};

export default UserInfo;
