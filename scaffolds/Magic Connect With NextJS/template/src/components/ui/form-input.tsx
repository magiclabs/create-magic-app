import React from 'react';

interface Props {
  value: string;
  onChange: (e: any) => void;
  placeholder: string;
}

const FormInput = ({ value, onChange, placeholder }: Props) => {
  return <input className="form-input" value={value} onChange={onChange} placeholder={placeholder} />;
};

export default FormInput;
