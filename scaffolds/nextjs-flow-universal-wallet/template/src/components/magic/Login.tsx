import React, { useState, useCallback } from 'react';
import AppHeader from '../ui/AppHeader';
import Links from './DevLinks';
import ConnectButton from '../ui/ConnectButton';
import Spacer from '../ui/Spacer';
import { useMagicContext } from '@/components/magic/MagicProvider';

interface Props {
  setAccount: React.Dispatch<React.SetStateAction<string | null>>;
}

const Login = ({ setAccount }: Props) => {
  const [disabled, setDisabled] = useState(false);
  const { magic } = useMagicContext();

  const connect = useCallback(async () => {
    if (!magic) return;
    try {
      setDisabled(true);
      const token = await magic.flow.getAccount();
      setDisabled(false);
      console.log('Logged in user:', token);
      localStorage.setItem('user', token);
      setAccount(token);
    } catch (error) {
      setDisabled(false);
      console.error(error);
    }
  }, [magic, setAccount]);

  return (
    <div className="login-page">
      <AppHeader />
      <Spacer size={32} />
      <Spacer size={20} />
      <ConnectButton onClick={connect} disabled={disabled} />
      <Links footer />
    </div>
  );
};

export default Login;
