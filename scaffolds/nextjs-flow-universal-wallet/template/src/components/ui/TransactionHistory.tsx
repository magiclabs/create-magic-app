import React from 'react'
import Image from 'next/image'
import Link from 'public/link.svg'
import {getBlockExplorer} from '@/utils/networks'

const TransactionHistory = () => {
	const blockExplorer = getBlockExplorer()
	const publicAddress = localStorage.getItem('user')

	return (
		<a
			className='action-buttion'
			href={`${blockExplorer}/account/${publicAddress}`}
			target='_blank'
			rel='noreferrer'>
			<div className='flex items-center justify-center'>
				Transaction History{' '}
				<Image src={Link} alt='link-icon' className='ml-[3px]' />
			</div>
		</a>
	)
}

export default TransactionHistory
