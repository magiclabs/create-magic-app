import React from 'react';
import WalletMethods from '../magic/cards/WalletMethodsCard';
import SendTransaction from '../magic/cards/SendTransactionCard';
import Spacer from '@/components/ui/Spacer';
import { LoginProps } from '@/utils/types';
import UserInfo from '@/components/magic/cards/UserInfoCard';
import DevLinks from './DevLinks';
import Header from './Header';
import SmartContract from '../magic/cards/SmartContract';
import { isTestnet } from '@/utils/smartContract';

export default function Dashboard({ token, setToken }: LoginProps) {
  return (
    <div className="home-page">
      <Header />
      <div className="cards-container">
        <UserInfo token={token} setToken={setToken} />
        <Spacer size={10} />
        <SendTransaction />
        <Spacer size={10} />
        <WalletMethods token={token} setToken={setToken} />
        <Spacer size={15} />
        {isTestnet() && <SmartContract />}
      </div>
      <DevLinks primary />
    </div>
  );
}
