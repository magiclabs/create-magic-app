import {ReactNode} from 'react'

const Card = ({children}: {children: ReactNode}) => {
	return (
		<div className='bg-white p-4 rounded-lg drop-shadow-lg'>{children}</div>
	)
}

export default Card
