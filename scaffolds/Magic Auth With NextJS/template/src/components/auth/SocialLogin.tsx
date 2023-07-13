import {LoginProps} from '@/utils/types'
import Card from '../card/Card'
import CardHeader from '../card/CardHeader'
import google from 'public/google.png'
import facebook from 'public/facebook.svg'
import github from 'public/github.svg'
import Image from 'next/image'
import {useMagic} from '../provider/MagicProvider'
import {logout, saveToken} from '@/utils/common'
import {useEffect, useState} from 'react'
import classNames from 'classnames'
import Spinner from '../ui/Spinner'
import {Magic} from 'magic-sdk'
import {OAuthExtension} from '@magic-ext/oauth'

const SocialGridItem = ({
	name,
	image,
	onClick,
	disabled,
}: {
	name: string
	image: any
	onClick: () => void
	disabled: boolean
}) => {
	return (
		<div
			className={classNames(
				'flex flex-col items-center justify-center m-2',
				disabled ? 'cursor-default' : 'cursor-pointer'
			)}
			onClick={() => {
				if (!disabled) onClick()
			}}>
			<Image src={image} alt={name} height={24} width={24} />
			<div className='text-xs font-semibold'>{name}</div>
		</div>
	)
}

const SocialLogin = ({token, setToken}: LoginProps) => {
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
					saveToken(result.magic.idToken, setToken)
					setLoadingFlag('false')
				}
			} catch (e) {
				console.log('social login error: ' + e)
				setLoadingFlag('false')
			}
		}

		checkLogin()
	}, [magic])

	const login = async (provider: string, redirectURI: string = '') => {
		setLoadingFlag('true')
		await magic?.oauth.loginWithRedirect({
			provider: 'google',
			redirectURI: redirectURI,
		})
	}

	const setLoadingFlag = (loading: string) => {
		localStorage.setItem('isAuthLoading', loading)
		setIsAuthLoading(loading)
	}

	return (
		<Card>
			<CardHeader title='Social Logins' />
			{isAuthLoading == 'true' ? (
				<Spinner />
			) : (
				<>
					{token.length > 0 && (
						<div className='text-xs p-1 flex flex-row my-2'>
							<div className='flex-[1.5] text-xs text-start font-semibold text-red-700'>
								Already Logged in
							</div>
							<button
								className='flex-1 text-end cursor-pointer font-semibold'
								onClick={() => logout(setToken, magic)}>
								Logout
							</button>
						</div>
					)}
					<div className='grid grid-cols-3 gap-1'>
						<SocialGridItem
							name='Google'
							image={google}
							onClick={() =>
								login('google', `${window.location.origin}`)
							}
							disabled={token.length > 0}
						/>
						<SocialGridItem
							name='Facebook'
							image={facebook}
							onClick={() => login('facebook')}
							disabled={token.length > 0}
						/>
						<SocialGridItem
							name='Github'
							image={github}
							onClick={() => login('github')}
							disabled={token.length > 0}
						/>
					</div>
				</>
			)}
		</Card>
	)
}

export default SocialLogin
