import { useState, useEffect } from 'react';
import Layout from './layout';
import { Magic } from 'magic-sdk';

const Callback = (props) => {
  const [magic, setMagic] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [showNextStep, setShowNextStep] = useState(false);

  let magicCredentialParam;

  useEffect(() => {
    const params = new URLSearchParams(props.location.search);
    magicCredentialParam = params.get('magic_credential');
    !magic && setMagic(new Magic(process.env.REACT_APP_MAGIC_PUBLISHABLE_KEY));
    magic && finishEmailRedirectLogin();
  }, [magic, props.location.search]);

  const finishEmailRedirectLogin = async () => {
    if (magicCredentialParam) {
      console.log(true);
      try {
        let didToken = await magic.auth.loginWithCredential();
        setShowNextStep(true);
        let res = await authenticateWithServer(didToken);
        res.status === 200 && props.history.push('/');
      } catch (error) {
        console.error('An unexpected error happened occurred:', error);
        setErrorMsg('Error logging in. Please try again.');
      }
    }
  };

  const authenticateWithServer = async (didToken) => {
    return await fetch(`${process.env.REACT_APP_SERVER_URL}/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + didToken,
      },
      credentials: 'include',
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

      <style>{`
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
