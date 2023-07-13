import React from 'react';

interface Props {
  children: React.ReactNode;
  id: string;
}

const CardHeader = ({ children, id }: Props) => {
  return (
    <h1 className="card-header" id={id}>
      {children}
    </h1>
  );
};

export default CardHeader;
