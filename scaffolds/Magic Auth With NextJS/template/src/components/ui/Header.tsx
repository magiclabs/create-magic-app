import Image from 'next/image'
import Link from 'next/link'
import MagicColorWhite from 'public/magic_color_white.svg'
import {Dispatch, SetStateAction, useEffect, useState} from 'react'
import DevLinks from './dev-links'

interface HeaderProps {
	token: string
	setToken: Dispatch<SetStateAction<string>>
}

const Header = (props: HeaderProps) => {
	return (
		<div className='w-full drop-shadow-[0_35px_35px_rgba(0,0,0,0.25)] min-h-[30vh] flex flex-col items-center bg-magic'>
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
