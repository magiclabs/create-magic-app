import Header from '../components/magic/Header';
import MagicProvider from '../components/magic/MagicProvider';
import { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from '@/components/magic/Login';
import Dashboard from '@/components/magic/Dashboard';
import MagicDashboardRedirect from '@/components/magic/MagicDashboardRedirect';

export default function Home() {
  const [token, setToken] = useState('');

  useEffect(() => {
    setToken(localStorage.getItem('token') ?? '');
  }, [setToken]);

  return (
    <MagicProvider>
      <ToastContainer />
      <Header />
      {process.env.NEXT_PUBLIC_MAGIC_API_KEY ? (
        token.length > 0 ? (
          <Dashboard token={token} setToken={setToken} />
        ) : (
          <Login token={token} setToken={setToken} />
        )
      ) : (
        <MagicDashboardRedirect />
      )}
    </MagicProvider>
  );
}
