import React from 'react'

interface Props {
  value?: string
  type?: string
  onChange: (e: any) => void
  placeholder: string
}

const FormInput = ({ value, type, onChange, placeholder }: Props) => {
  return (
    <input
      type={type ?? 'text'}
      className='form-input'
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  )
}

export default FormInput
