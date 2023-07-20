import {Dispatch, SetStateAction, useEffect, useState} from 'react'
import {useMagic} from '../provider/MagicProvider'
import Toast from '@/utils/Toast'
import Spinner from '../ui/Spinner'
import classNames from 'classnames'
import {RPCError, RPCErrorCode} from 'magic-sdk'
import {LoginProps} from '@/utils/types'
import {logout, saveToken} from '@/utils/common'
import Card from '../ui/card'
import CardHeader from '../ui/card-header'

const SMSOTP = ({token, setToken}: LoginProps) => {
	const {magic} = useMagic()
	const [phone, setPhone] = useState('')
	const [phoneError, setPhoneError] = useState(false)
	const [isLoginInProgress, setLoginInProgress] = useState(false)

	const handleLogin = async () => {
		if (!phone.match(/^\+?\d{10,14}$/)) {
			setPhoneError(true)
		} else {
			try {
				setLoginInProgress(true)
				if (await magic?.user.isLoggedIn()) {
					await magic?.user.logout()
				}
				setPhoneError(false)
				const account = await magic?.auth.loginWithSMS({
					phoneNumber: phone,
				})
				console.log('phone account: ' + account)
				if (account) {
					saveToken(account, setToken)
					setPhone('')
				}
			} catch (e) {
				console.log('login error: ' + JSON.stringify(e))
				if (e instanceof RPCError) {
					switch (e.code) {
						case RPCErrorCode.MagicLinkFailedVerification:
						case RPCErrorCode.MagicLinkExpired:
						case RPCErrorCode.MagicLinkRateLimited:
						case RPCErrorCode.UserAlreadyLoggedIn:
							Toast({message: e.message, type: 'error'})
							break
						default:
							Toast({
								message:
									'Something went wrong. Please try again',
								type: 'error',
							})
					}
				}
			} finally {
				setLoginInProgress(false)
			}
		}
	}

	const handleLogout = () => {
		logout(setToken, magic)
	}
	return (
		<Card>
			<CardHeader id='sms'>SMS Login</CardHeader>
			<div className='flex flex-col items-center justify-center'>
				<input
					onChange={(e) => {
						if (phoneError) setPhoneError(false)
						setPhone(e.target.value)
					}}
					placeholder={
						token.length > 0 ? 'Already logged in' : '+11234567890'
					}
					value={phone}
					className='p-2 border-solid border-[1px] border-[#A799FF] rounded-lg w-full mt-2'
					disabled={token.length > 0}
				/>
				{phoneError && (
					<span className='text-red-700 justify-self-start self-start text-xs font-semibold'>
						Enter a valid phone number
					</span>
				)}
				<button
					className={classNames(
						'w-full rounded-3xl px-8 py-2 bg-[#A799FF] enabled:hover:bg-[#A799FF]/[0.5] text-center text-white font-medium disabled:cursor-default cursor-pointer my-2 items-center justify-center'
					)}
					disabled={
						isLoginInProgress ||
						(token.length > 0 ? false : phone.length == 0)
					}
					onClick={() =>
						token.length > 0 ? handleLogout() : handleLogin()
					}>
					{isLoginInProgress ? (
						<Spinner />
					) : token.length > 0 ? (
						'Logout'
					) : (
						'Login'
					)}
				</button>
			</div>
		</Card>
	)
}

export default SMSOTP
