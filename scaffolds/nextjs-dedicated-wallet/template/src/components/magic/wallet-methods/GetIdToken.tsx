import React, { useCallback, useState } from 'react';
import { useMagic } from '@/hooks/MagicProvider';
import showToast from '@/utils/showToast';
import Spinner from '@/components/ui/Spinner';

const GetIdToken = () => {
  const { magic } = useMagic();
  const [disabled, setDisabled] = useState(false);

  const getWalletType = useCallback(async () => {
    if (!magic) return;
    try {
      setDisabled(true);
      const idToken = await magic.user.getIdToken();
      setDisabled(false);
      console.log('ID Token: ' + idToken);
      showToast({
        message: 'Please check console for the ID Token Log',
        type: 'success',
      });
    } catch (error) {
      setDisabled(false);
      console.error(error);
    }
  }, [magic]);

  return (
    <div className="wallet-method-container">
      <button className="wallet-method" onClick={getWalletType} disabled={disabled}>
        {disabled ? (
          <div className="loading-container w-[86px]">
            <Spinner />
          </div>
        ) : (
          'getIdToken()'
        )}
      </button>
      <div className="wallet-method-desc">
        Generates a Decentralized Id Token which acts as a proof of authentication to resource servers.
      </div>
    </div>
  );
};

export default GetIdToken;
