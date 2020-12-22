import { useState, useEffect } from 'react';
import { useUser } from '../lib/hooks';
import Layout from './layout';
import Form from './form';
import { Magic } from 'magic-sdk';
import { useHistory } from 'react-router-dom';

const Login = () => {
  const history = useHistory();
  useUser({ redirectTo: '/', redirectIfFound: true });
  const [magic, setMagic] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    !magic && setMagic(new Magic(process.env.REACT_APP_MAGIC_PUBLISHABLE_KEY));
    magic?.preload();
  }, [magic]);

  async function handleLoginWithMagic(e) {
    e.preventDefault();
    if (errorMsg) setErrorMsg('');

    try {
      /* email magic link to user & specify redirectURI for after link is clicked */
      let didToken = await magic.auth.loginWithMagicLink({
        email: e.currentTarget.email.value,
        redirectURI: `${process.env.REACT_APP_CLIENT_URL}/callback`,
      });
      /* validate token with server */
      const res = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + didToken,
        },
        credentials: 'include',
      });
      /* redirect home if authentication was successful */
      res.status === 200 && history.push('/');
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
      <style>{`
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
