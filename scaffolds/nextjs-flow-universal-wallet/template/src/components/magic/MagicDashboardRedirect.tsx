import React, {useCallback} from 'react'
import AppHeader from '../ui/AppHeader'
import Links from './Links'
import Spacer from '../ui/Spacer'

const MagicDashboardRedirect = () => {
	const onClick = useCallback(() => {
		window.open('https://dashboard.magic.link/signup', '_blank')
	}, [])

	return (
		<div className='redirect-container'>
			<AppHeader />
			<Spacer size={32} />
			<Spacer size={20} />
			<div className='text-center'>
				<h3 className='max-w-[500px] text-center text-[#ffffffcc] text-xl font-normal m-0'>
					Please set your <code>NEXT_PUBLIC_MAGIC_API_KEY</code>{' '}
					environment variable in <code>.env</code>. You can get your
					Magic API key from the Magic Dashboard.
				</h3>
			</div>
			<Spacer size={32} />
			<div className='text-center'>
				<button className='connect-button' onClick={onClick}>
					Go to Dashboard
				</button>
			</div>
			<Links footer />
		</div>
	)
}

export default MagicDashboardRedirect
