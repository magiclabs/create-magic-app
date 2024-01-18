import { useState } from 'react';
import { useMagic } from '../MagicProvider';
import showToast from '@/utils/showToast';
import Spinner from '../../ui/Spinner';
import { RPCError, RPCErrorCode } from 'magic-sdk';
import { LoginProps } from '@/utils/types';
import { saveToken } from '@/utils/common';
import Card from '../../ui/Card';
import CardHeader from '../../ui/CardHeader';
import FormInput from '@/components/ui/FormInput';

const SMSOTP = ({ token, setToken }: LoginProps) => {
  const { magic } = useMagic();
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState(false);
  const [isLoginInProgress, setLoginInProgress] = useState(false);

  const handleLogin = async () => {
    if (!phone.match(/^\+?\d{10,14}$/)) {
      setPhoneError(true);
    } else {
      try {
        setLoginInProgress(true);
        setPhoneError(false);
        const token = await magic?.auth.loginWithSMS({
          phoneNumber: phone,
        });
        if (token) {
          saveToken(token, setToken, 'SMS');
          setPhone('');
        }
      } catch (e) {
        console.log('login error: ' + JSON.stringify(e));
        if (e instanceof RPCError) {
          switch (e.code) {
            case RPCErrorCode.MagicLinkFailedVerification:
            case RPCErrorCode.MagicLinkExpired:
            case RPCErrorCode.MagicLinkRateLimited:
            case RPCErrorCode.UserAlreadyLoggedIn:
              showToast({ message: e.message, type: 'error' });
              break;
            default:
              showToast({
                message: 'Something went wrong. Please try again',
                type: 'error',
              });
          }
        }
      } finally {
        setLoginInProgress(false);
      }
    }
  };

  return (
    <Card>
      <CardHeader id="sms">SMS Login</CardHeader>
      <div className="login-method-grid-item-container">
        <FormInput
          onChange={(e) => {
            if (phoneError) setPhoneError(false);
            setPhone(e.target.value);
          }}
          placeholder={token.length > 0 ? 'Already logged in' : '+11234567890'}
          value={phone}
        />
        {phoneError && (
          <span className="self-start text-xs font-semibold text-red-700 justify-self-start">
            Enter a valid phone number
          </span>
        )}
        <button
          className="login-button"
          disabled={isLoginInProgress || (token.length > 0 ? false : phone.length == 0)}
          onClick={() => handleLogin()}
        >
          {isLoginInProgress ? <Spinner /> : 'Log in / Sign up'}
        </button>
      </div>
    </Card>
  );
};

export default SMSOTP;
