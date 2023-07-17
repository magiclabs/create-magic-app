import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import Card from '../card/Card';
import CardHeader from '../card/CardHeader';
import { useMagic } from '../provider/MagicProvider';
import Toast from '@/utils/Toast';
import Spinner from '../ui/Spinner';
import classNames from 'classnames';
import { RPCError, RPCErrorCode } from 'magic-sdk';
import { LoginProps } from '@/utils/types';
import { logout, saveToken } from '@/utils/common';

const EmailOTP = ({ token, setToken }: LoginProps) => {
  const { magic } = useMagic();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [isLoginInProgress, setLoginInProgress] = useState(false);

  const handleLogin = async () => {
    if (!email.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)) {
      setEmailError(true);
    } else {
      try {
        setLoginInProgress(true);
        if (await magic?.user.isLoggedIn()) {
          await magic?.user.logout();
        }
        setEmailError(false);
        const account = await magic?.auth.loginWithEmailOTP({ email });
        if (account) {
          saveToken(token, setToken);
          setEmail('');
        }
      } catch (e) {
        console.log('login error: ' + JSON.stringify(e));
        if (e instanceof RPCError) {
          switch (e.code) {
            case RPCErrorCode.MagicLinkFailedVerification:
            case RPCErrorCode.MagicLinkExpired:
            case RPCErrorCode.MagicLinkRateLimited:
            case RPCErrorCode.UserAlreadyLoggedIn:
              Toast({ message: e.message, type: 'error' });
              break;
            default:
              Toast({
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

  const handleLogout = () => {
    logout(setToken, magic);
  };
  return (
    <Card>
      <CardHeader title="Email Login" />
      <div className="flex flex-col items-center justify-center">
        <input
          onChange={(e) => {
            if (emailError) setEmailError(false);
            setEmail(e.target.value);
          }}
          placeholder={token.length > 0 ? 'Already logged in' : 'Email'}
          value={email}
          className="p-2 border-solid border-[1px] border-[#A799FF] rounded-lg w-full mt-2"
          disabled={token.length > 0}
        />
        {emailError && (
          <span className="text-red-700 justify-self-start self-start text-xs font-semibold">Enter a valid email</span>
        )}
        <button
          className={classNames(
            'w-full rounded-3xl px-8 py-2 bg-[#A799FF] enabled:hover:bg-[#A799FF]/[0.5] text-center text-white font-medium disabled:cursor-default cursor-pointer my-2 items-center justify-center',
          )}
          disabled={isLoginInProgress || (token.length > 0 ? false : email.length == 0)}
          onClick={() => (token.length > 0 ? handleLogout() : handleLogin())}
        >
          {isLoginInProgress ? <Spinner /> : token.length > 0 ? 'Logout' : 'Login with OTP'}
        </button>
      </div>
    </Card>
  );
};

export default EmailOTP;
