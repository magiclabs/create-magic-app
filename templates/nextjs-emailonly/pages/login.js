import { useState, useEffect } from 'react';
import Router from 'next/router';
import { useUser } from '../lib/hooks';
import Layout from '../components/layout';
import Form from '../components/form';
import { Magic } from 'magic-sdk';

const Login = () => {
  useUser({ redirectTo: '/', redirectIfFound: true });
  const [magic, setMagic] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    !magic && setMagic(new Magic(process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY));
    magic?.preload();
  }, [magic]);

  async function handleLoginWithMagic(e) {
    e.preventDefault();
    if (errorMsg) setErrorMsg('');

    try {
      /* email magic link to user & specify redirectURI for after link is clicked */
      let didToken = await magic.auth.loginWithMagicLink({
        email: e.currentTarget.email.value,
        redirectURI: `${process.env.NEXT_PUBLIC_SERVER_URL}/callback`,
      });
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + didToken,
        },
      });
      if (res.status === 200) {
        Router.push('/');
      } else {
        throw new Error(await res.text());
      }
    } catch (error) {
      console.error('An unexpected error happened occurred:', error);
      setErrorMsg(error.message);
    }
  }

  return (
    <Layout>
      <div className='login'>
        <Form errorMessage={errorMsg} onSubmit={handleLoginWithMagic} />
      </div>
      <style jsx>{`
        .login {
          max-width: 20rem;
          margin: 0 auto;
          padding: 1rem 1rem 3rem 1rem;
          border: 1px solid #ccc;
          border-radius: 4px;
          text-align: center;
        }
      `}</style>
    </Layout>
  );
};

export default Login;
