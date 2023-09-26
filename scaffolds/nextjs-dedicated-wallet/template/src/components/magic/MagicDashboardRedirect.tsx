import React, { useCallback } from 'react';
import DevLinks from './DevLinks';
import Image from 'next/image';
import Info from 'public/info.svg';
import Link from 'public/link_white.svg';
import Logo from 'public/logo.svg';

const MagicDashboardRedirect = () => {
  const onClick = useCallback(() => {
    window.open('https://dashboard.magic.link/signup', '_blank');
  }, []);

  return (
    <div className="redirect-container">
      <div className="flex flex-col mt-10 gap-2.5 items-center">
        <Image src={Logo} alt="logo" />
        <div className="text-center text-white text-xl font-extrabold font-['Inter'] leading-[30px]">Magic</div>
        <div className="text-center text-white text-opacity-50 text-base font-normal font-['SF Mono'] leading-normal">
          Demo
        </div>
      </div>
      <div className="flex flex-col items-center flex-1">
        <div className="redirect-card">
          <div className="flex gap-2 mx-4 my-2 ">
            <Image src={Info} alt="logo" />
            <h3 className="max-w-[480px] text-[#4E4D52] text-base font-normal">
              Please set your <code>NEXT_PUBLIC_MAGIC_API_KEY</code> environment variable in <code>.env</code>. You can
              get your Magic API key from the Magic Dashboard.
            </h3>
          </div>
        </div>

        <button className="api-button" onClick={onClick} disabled={false}>
          Get API keys
          <Image src={Link} alt="link-icon" className="ml-[6px] my-auto" />
        </button>
      </div>
      <DevLinks />
    </div>
  );
};

export default MagicDashboardRedirect;
