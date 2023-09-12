import React from 'react';
import Loading from 'public/loading.svg';
import Image from 'next/image';
interface Props {
  onClick: () => void;
  disabled: boolean;
}

const ConnectButton = ({ onClick, disabled }: Props) => {
  return (
    <div className="text-center">
      <button className="connect-button" onClick={onClick} disabled={disabled}>
        {disabled ? (
          <div className="loading-container min-w-full">
            <Image className="loading" alt="loading" src={Loading} />
          </div>
        ) : (
          'Connect'
        )}
      </button>
    </div>
  );
};

export default ConnectButton;
