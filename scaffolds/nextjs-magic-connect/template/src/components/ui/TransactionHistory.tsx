import React from 'react';
import Image from 'next/image';
import Link from 'public/link.svg';
import { getBlockExplorer } from '@/utils/networks';

const TransactionHistory = () => {
  const blockExplorer = getBlockExplorer();
  const publicAddress = localStorage.getItem('user');

  return (
    <a className="action-button" href={`${blockExplorer}/address/${publicAddress}`} target="_blank" rel="noreferrer">
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
