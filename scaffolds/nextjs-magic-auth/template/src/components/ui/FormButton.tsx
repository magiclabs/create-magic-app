import React from 'react'

interface Props {
	children: React.ReactNode
	onClick: () => void
	disabled: boolean
}

const FormButton = ({children, onClick, disabled}: Props) => {
  return (
    <button className='form-button' disabled={disabled} onClick={onClick}>
      {children}
    </button>
  )
}

export default FormButton
