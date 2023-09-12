import React from 'react'

interface Props {
	children: React.ReactNode
	onClick: () => void
	disabled: boolean
}

const FormButton = ({children, onClick, disabled}: Props) => {
	return (
		<button
			className={`flex flex-row justify-center items-center w-full h-12 text-[#522fd4] font-semibold text-base leading-6 transition-[0.1s]
				px-6 py-3 rounded-[300px] border-[none] bg-[#edebff] font-['Inter'] disabled:opacity-50 hover:enabled:cursor-pointer active:enabled:scale-[0.99]
				hover:enabled:bg-gradient-to-r from-[#0000000d] to-[#0000000d]  active:enabled:bg-gradient-to-r from-[#0000000d] to-[#0000000d]`}
			disabled={disabled}
			onClick={onClick}>
			{children}
		</button>
	)
}

export default FormButton
