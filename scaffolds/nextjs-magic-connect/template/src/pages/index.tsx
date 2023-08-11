import React, { useState, useEffect } from 'react';
import Login from '../components/magic/Login';
import Home from '../components/magic/Home';
import MagicDashboardRedirect from '@/components/magic/MagicDashboardRedirect';

export default function App() {
  const [account, setAccount] = useState<string | null>(null);

  useEffect(() => {
    const user = localStorage.getItem('user');
    setAccount(user);
  }, []);

  /**
   * If no Magic API key is set, instruct user to go to Magic Dashboard.
   * Otherwise, if user is not logged in, show the Login component.
   * Otherwise, show the Home component.
   */
  return process.env.NEXT_PUBLIC_MAGIC_API_KEY ? (
    !account ? (
      <Login setAccount={setAccount} />
    ) : (
      <Home setAccount={setAccount} />
    )
  ) : (
    <MagicDashboardRedirect />
  );
}
