import React from 'react';
import WalletMethods from './cards/WalletMethodsCard';
import SendTransaction from './cards/SendTransactionCard';
import Spacer from '@/components/ui/Spacer';
import { LoginProps } from '@/utils/types';
import UserInfo from './cards/UserInfoCard';
import DevLinks from './DevLinks';

export default function Dashboard({ token, setToken }: LoginProps) {
  return (
    <div className="home-page">
      <Spacer size={32} />
      <Spacer size={120} />
      <div className="cards-container">
        <SendTransaction />
        <Spacer size={10} />
        <UserInfo token={token} setToken={setToken} />
        <Spacer size={10} />
        <WalletMethods token={token} setToken={setToken} />
        <Spacer size={15} />
      </div>
      <DevLinks primary />
    </div>
  );
}
