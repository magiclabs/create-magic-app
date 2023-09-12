import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import Divider from '../../ui/Divider';
import Loading from 'public/loading.svg';
import CardLabel from '../../ui/CardLabel';
import Card from '../../ui/Card';
import CardHeader from '../../ui/CardHeader';
import { useMagicContext } from '@/components/magic/MagicProvider';
import { getNetworkName, getNetworkToken } from '@/utils/networks';

interface Props {
  setAccount: React.Dispatch<React.SetStateAction<string | null>>;
}

const UserInfo = ({ setAccount }: Props) => {
  const { magic, web3 } = useMagicContext();

  const [balance, setBalance] = useState('...');
  const [copied, setCopied] = useState('Copy');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const publicAddress = localStorage.getItem('user');
  const network = localStorage.getItem('network');
  const tokenSymbol = getNetworkToken();

  const getBalance = useCallback(async () => {
    if (publicAddress && web3) {
      const balance = await web3.eth.getBalance(publicAddress);
      setBalance(web3.utils.fromWei(balance));
      console.log('BALANCE: ', balance);
    }
  }, [web3, publicAddress]);

  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    await getBalance();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 500);
  }, [getBalance]);

  useEffect(() => {
    if (web3) {
      refresh();
    }
  }, [web3, refresh]);

  useEffect(() => {
    setBalance('...');
  }, [magic]);

  const disconnect = useCallback(async () => {
    if (magic) {
      await magic.wallet.disconnect();
      localStorage.removeItem('user');
      setAccount(null);
    }
  }, [magic, setAccount]);

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
      <CardHeader id="wallet">Wallet</CardHeader>
      <CardLabel leftHeader="Status" rightAction={<div onClick={disconnect}>Disconnect</div>} isDisconnect />
      <div className="flex-row">
        <div className="green-dot" />
        <div className="connected">Connected to {getNetworkName()}</div>
      </div>
      <Divider />
      <CardLabel leftHeader="Address" rightAction={<div onClick={copy}>{copied}</div>} />
      <div className="code">{publicAddress}</div>
      <Divider />
      <CardLabel
        leftHeader="Balance"
        rightAction={
          isRefreshing ? (
            <div className="loading-container">
              <Image className="loading" alt="loading" src={Loading} />
            </div>
          ) : (
            <div onClick={refresh}>Refresh</div>
          )
        }
      />
      <div className="code">
        {balance.substring(0, 7)} {tokenSymbol}
      </div>
    </Card>
  );
};

export default UserInfo;
