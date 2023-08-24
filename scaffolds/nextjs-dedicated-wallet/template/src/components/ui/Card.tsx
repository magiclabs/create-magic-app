import React from 'react';

interface Props {
  children: React.ReactNode;
}

const Card = ({ children }: Props) => {
  return <div className="card">{children}</div>;
};

export default Card;
