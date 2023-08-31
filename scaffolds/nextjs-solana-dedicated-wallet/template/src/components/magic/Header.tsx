import Image from 'next/image'
import MagicColorWhite from 'public/magic_color_white.svg'
import {Dispatch, SetStateAction} from 'react'
import DevLinks from './DevLinks'

const Header = () => {
	return (
		<div className='app-header-container'>
			<Image
				className='h-[180] w-[120px] m-2'
				src={MagicColorWhite}
				alt='logo'
			/>
			<DevLinks />
		</div>
	)
}

export default Header
