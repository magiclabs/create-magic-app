import {useState} from 'react'
import Spinner from '../ui/Spinner'
import classNames from 'classnames'
import ActionButton, {ActionProps} from './ActionButton'

type BodyProps = {
	label?: string
	value: string
	needDivider?: boolean
	action?: ActionProps
}

const CardBody = ({label, value, action, needDivider = false}: BodyProps) => {
	return (
		<div className='my-1'>
			<div className='flex items-center'>
				<div className='flex-1 text-sm font-medium'>{label}</div>
				{action && (
					<ActionButton
						title={action.title}
						type={action.type}
						loading={action.loading}
						onClick={action.onClick}
					/>
				)}
			</div>
			<div className='text-sm font-medium p-2 mt-2 bg-[#E0E0E0] rounded-md break-words'>
				{value}
			</div>
			{needDivider && <hr className='mt-2 bg-[#BDBDBD]' />}
		</div>
	)
}

export default CardBody
