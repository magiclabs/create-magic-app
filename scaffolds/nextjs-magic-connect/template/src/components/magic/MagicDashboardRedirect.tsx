import React, { useCallback } from 'react';
import AppHeader from '../ui/AppHeader';
import Links from './Links';
import Spacer from '../ui/Spacer';
import LoginPageBackground from 'public/login.svg';

const MagicDashboardRedirect = () => {
  const onClick = useCallback(() => {
    window.open('https://dashboard.magic.link', '_blank');
  }, []);

  return (
    <div
      className="login-page"
      style={{
        backgroundImage: `url(${LoginPageBackground})`,
      }}
    >
      <AppHeader />
      <Spacer size={32} />
      <Spacer size={20} />
      <div style={{ textAlign: 'center' }}>
        <h3 className="paragraph">
          Please set your <code>NEXT_PUBLIC_MAGIC_API_KEY</code> environment variable in <code>.env</code>. You can get
          your Magic API key from the Magic Dashboard.
        </h3>
      </div>
      <Spacer size={32} />
      <div style={{ textAlign: 'center' }}>
        <button className="connect-button" onClick={onClick}>
          Go to Dashboard
        </button>
      </div>
      <Links footer />
    </div>
  );
};

export default MagicDashboardRedirect;
