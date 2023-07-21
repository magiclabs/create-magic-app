import { LoginProps } from '@/utils/types';
import { useMagic } from '../MagicProvider';
import { useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import { saveToken } from '@/utils/common';
import Spinner from '@/components/ui/Spinner';
import { useRouter } from 'next/router';
import Card from '@/components/ui/Card';
import CardHeader from '@/components/ui/CardHeader';

const setScriptAttributesAndAddScript = (src: string) => {
  const script = document.createElement('script');
  script.src = src;
  script.setAttribute('data-magic-publishable-api-key', process.env.NEXT_PUBLIC_MAGIC_API_KEY!);
  script.setAttribute('data-redirect-uri', '/');
  script.async = true;

  document.body.appendChild(script);
};

const LoginForm = ({ token, setToken }: LoginProps) => {
  const { magic } = useMagic();
  const router = useRouter();
  const [isLoginInProgress, setLoginInProgress] = useState(false);

  useMemo(async () => {
    if (token.length == 0 && router.query) {
      if (router.query.didt) {
        await saveToken(router.query.didt as string, setToken);
        router.replace('/', undefined, { shallow: true });
      }
      if (router.query.magic_credential) {
        await saveToken(router.query.magic_credential as string, setToken);
        router.replace('/', undefined, { shallow: true });
      }
    }
  }, [router, setToken, token.length]);

  useEffect(() => {
    if (token.length > 0 && !isLoginInProgress) {
      setLoginInProgress(false);
    }
  }, [token, setLoginInProgress, isLoginInProgress]);

  const handleLogin = () => {
    setLoginInProgress(true);
    setScriptAttributesAndAddScript('https://auth.magic.link/pnp/login');
  };

  return (
    <Card>
      <CardHeader id="login">Login Form</CardHeader>
      <button
        className={classNames(
          'w-full rounded-3xl px-8 py-2 bg-[#A799FF] enabled:hover:bg-[#A799FF]/[0.5] text-center text-white font-medium disabled:cursor-default cursor-pointer my-2 items-center justify-center',
        )}
        disabled={isLoginInProgress}
        onClick={() => handleLogin()}
      >
        {isLoginInProgress ? <Spinner /> : 'Login'}
      </button>
      <span className="text-xs">
        Please wait a few seconds after clicking login as this button is executing a magic script
      </span>
    </Card>
  );
};

export default LoginForm;