import Image from 'next/image';
import Logo from 'public/logo.svg';
import DevLinks from './DevLinks';

const Header = () => {
  return (
    <div className="app-header-container">
      <div className="flex flex-col gap-2.5 items-center">
        <Image src={Logo} alt="logo" />
        <div className="text-center text-white text-xl font-extrabold font-['Inter'] leading-[30px]">Magic</div>
        <div className="text-center text-white text-opacity-50 text-base font-normal font-['SF Mono'] leading-normal">
          Demo
        </div>
      </div>
      <DevLinks />
      <p className="text-sm font-semibold text-white">Read more about this template <a href="https://github.com/magiclabs/create-magic-app" target='_blank' className="cursor-pointer text-[#6851ff]">here</a></p>
    </div>
  );
};

export default Header;
