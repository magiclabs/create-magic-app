import {LoginProps} from '@/utils/types'
import {useMagic} from '../provider/MagicProvider'
import {useEffect, useState} from 'react'
import {logout, saveToken} from '@/utils/common'
import Spinner from '../ui/Spinner'
import classNames from 'classnames'
import Image from 'next/image'
import facebook from 'public/facebook.svg'
import Card from '../ui/card'
import CardHeader from '../ui/card-header'

const FacebookLogin = ({token, setToken}: LoginProps) => {
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

	const login = async () => {
		setLoadingFlag('true')
		await magic?.oauth.loginWithRedirect({
			provider: 'facebook',
			redirectURI: window.location.origin,
		})
	}

	const setLoadingFlag = (loading: string) => {
		localStorage.setItem('isAuthLoading', loading)
		setIsAuthLoading(loading)
	}

	return (
		<Card>
			<CardHeader id='facebook'>Facebook Login</CardHeader>
			{isAuthLoading && isAuthLoading !== 'false' ? (
				<Spinner />
			) : (
				<div className='flex flex-col items-center justify-center'>
					{token.length > 0 && (
						<div className='text-xs p-1 flex flex-1 flex-row my-2 w-[100%]'>
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
							src={facebook}
							alt='Google'
							height={24}
							width={24}
						/>
						<div className='text-xs font-semibold'>Facebook</div>
					</div>
				</div>
			)}
		</Card>
	)
}
export default FacebookLogin
