import React from 'react';
import MagicLogo from 'public/magic.svg';
import Image from 'next/image';

const AppHeader = () => {
  return (
    <div className="app-header-container">
      <Image src={MagicLogo} alt="magic-logo" className="magic-logo" />
      <h3 className="demo-sub-header">Demo</h3>
    </div>
  );
};

export default AppHeader;
