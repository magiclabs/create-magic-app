import Image from 'next/image'
import Link from 'next/link'
import MagicColorWhite from 'public/magic_color_white.svg'
import {Dispatch, SetStateAction, useEffect, useState} from 'react'
import {Network, NetworkOption, getFormattedNetwork} from '@/utils/network'

interface HeaderProps {
	selectedNetwork: NetworkOption | null
	setSelectedNetwork: Dispatch<SetStateAction<NetworkOption | null>>
	token: string
	setToken: Dispatch<SetStateAction<string>>
}

const Header = (props: HeaderProps) => {
	return (
		<div className='w-full drop-shadow-[0_35px_35px_rgba(0,0,0,0.25)] h-[64px] flex items-center'>
			<Image
				className='h-[180] w-[120px] m-2'
				src={MagicColorWhite}
				alt='logo'
			/>
			<Link
				href='https://magic.link/docs'
				className='text-white font-medium underline mx-4'>
				Docs
			</Link>
			<div className='text-white'>|</div>
			<Link
				href='https://dashboard.magic.link/signup'
				className='text-white font-medium underline mx-4'>
				Dashboard
			</Link>
			<div className='text-white'>|</div>
			<Link
				href='https://discord.com/invite/magiclabs'
				className='text-white font-medium underline mx-4'>
				Discord
			</Link>

			<select
				className='text-black border-none rounded-md px-4 py-2 my-4'
				value={props.selectedNetwork?.value}
				onChange={(e: any) =>
					props.setSelectedNetwork(
						getFormattedNetwork(e.target.value)
					)
				}>
				{Object.keys(Network).map((key) => (
					<option
						className='text-black'
						value={getFormattedNetwork(Network[key]).value}>
						{Network[key]}
					</option>
				))}
			</select>
		</div>
	)
}

export default Header
