import { useState, useEffect } from 'react';
import Router, { useRouter } from 'next/router';
import Layout from '../components/layout';
import { Magic } from 'magic-sdk';

const Callback = () => {
  const [magic, setMagic] = useState(null);
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState('');
  const [showNextStep, setShowNextStep] = useState(false);

  useEffect(() => {
    !magic && setMagic(new Magic(process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY));
    magic && finishEmailRedirectLogin();
  }, [magic, router.query]);

  const finishEmailRedirectLogin = async () => {
    if (router.query.magic_credential) {
      try {
        let didToken = await magic.auth.loginWithCredential();
        setShowNextStep(true);
        let res = await authenticateWithServer(didToken);
        res.status === 200 && Router.push('/');
      } catch (error) {
        console.error('An unexpected error happened occurred:', error);
        setErrorMsg('Error logging in. Please try again.');
      }
    }
  };

  const authenticateWithServer = async (didToken) => {
    return await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + didToken,
      },
    });
  };

  return (
    <Layout>
      {!errorMsg ? (
        <div className='callback-container'>
          <div style={{ margin: '25px 0' }}>Retrieving auth token...</div>
          {showNextStep && <div style={{ margin: '25px 0' }}>Validating token...</div>}
        </div>
      ) : (
        <div className='error'>{errorMsg}</div>
      )}

      <style jsx>{`
        .login {
          max-width: 21rem;
          margin: 0 auto;
          padding: 1rem;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        .error {
          color: red;
        }
        .callback-container {
          width: 100%;
          text-align: center;
        }
        .mono {
          font-family: monospace !important;
        }
      `}</style>
    </Layout>
  );
};

export default Callback;
