import React from 'react';
import Image from 'next/image';
import Link from 'public/link.svg';

const TransactionHistory = () => {
  const publicAddress = localStorage.getItem('user');

  return (
    <a
      className="action-button"
      href={`https://mumbai.polygonscan.com/address/${publicAddress}`}
      target="_blank"
      rel="noreferrer"
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        Transaction History <Image src={Link} alt="link-icon" style={{ marginLeft: '3px' }} />
      </div>
    </a>
  );
};

export default TransactionHistory;
