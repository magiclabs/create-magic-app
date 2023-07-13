import classNames from 'classnames'
import Spinner from '../ui/Spinner'
import {useState} from 'react'

export type ActionProps = {
	type: 'info' | 'error' | 'success'
	title: string
	loading?: boolean
	onClick: () => void
}

const ActionButton = ({type, title, onClick, loading = false}: ActionProps) => (
	<>
		{loading && <Spinner />}
		{!loading && (
			<div
				className={classNames(
					'text-md font-semibold p-2 rounded-lg cursor-pointer hover:bg-gray-200',
					type == 'error' && 'text-red-700',
					type == 'info' && 'text-blue-700',
					type == 'success' && 'text-green-700'
				)}
				onClick={() => onClick()}>
				{title}
			</div>
		)}
	</>
)

export default ActionButton
