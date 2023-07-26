import {LoginProps} from '@/utils/types'
import {useMagic} from '../MagicProvider'
import {useEffect, useState} from 'react'
import {saveToken} from '@/utils/common'
import Spinner from '@/components/ui/Spinner'
import classNames from 'classnames'
import Image from 'next/image'
import discord from 'public/social/Discord.svg'
import Card from '@/components/ui/Card'
import CardHeader from '@/components/ui/CardHeader'

const Discord = ({token, setToken}: LoginProps) => {
	const {magic} = useMagic()
	const [isAuthLoading, setIsAuthLoading] = useState<string | null>(null)

	useEffect(() => {
		setIsAuthLoading(localStorage.getItem('isAuthLoading'))
	}, [])

	useEffect(() => {
		const checkLogin = async () => {
			try {
				if (magic) {
					const result = await magic?.oauth.getRedirectResult()
					//do stuff with user profile data
					saveToken(result.magic.idToken, setToken, 'SOCIAL')
					setLoadingFlag('false')
				}
			} catch (e) {
				console.log('social login error: ' + e)
				setLoadingFlag('false')
			}
		}

		checkLogin()
	}, [magic, setToken])

	const login = async () => {
		setLoadingFlag('true')
		await magic?.oauth.loginWithRedirect({
			provider: 'discord',
			redirectURI: window.location.origin,
		})
	}

	const setLoadingFlag = (loading: string) => {
		localStorage.setItem('isAuthLoading', loading)
		setIsAuthLoading(loading)
	}

	return (
		<Card>
			<CardHeader id='discord'>Discord Login</CardHeader>
			{isAuthLoading && isAuthLoading !== 'false' ? (
				<Spinner />
			) : (
				<div className='flex flex-col items-center justify-center'>
					<div
						className={classNames(
							'flex flex-col items-center justify-center m-2',
							token.length > 0
								? 'cursor-default'
								: 'cursor-pointer'
						)}
						onClick={() => {
							if (token.length == 0) login()
						}}>
						<Image
							src={discord}
							alt='Discord'
							height={24}
							width={24}
						/>
						<div className='text-xs font-semibold'>Discord</div>
					</div>
				</div>
			)}
		</Card>
	)
}
export default Discord
