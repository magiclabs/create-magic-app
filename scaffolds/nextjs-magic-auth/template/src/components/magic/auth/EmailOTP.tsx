import {useMagic} from '../MagicProvider'
import showToast from '@/utils/showToast'
import Spinner from '../../ui/Spinner'
import classNames from 'classnames'
import {RPCError, RPCErrorCode} from 'magic-sdk'
import {LoginProps} from '@/utils/types'
import {saveToken} from '@/utils/common'
import Card from '../../ui/Card'
import CardHeader from '../../ui/CardHeader'
import {useState} from 'react'

const EmailOTP = ({token, setToken}: LoginProps) => {
	const {magic} = useMagic()
	const [email, setEmail] = useState('')
	const [emailError, setEmailError] = useState(false)
	const [isLoginInProgress, setLoginInProgress] = useState(false)

	const handleLogin = async () => {
		if (
			!email.match(
				/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
			)
		) {
			setEmailError(true)
		} else {
			try {
				setLoginInProgress(true)
				setEmailError(false)
				const account = await magic?.auth.loginWithEmailOTP({email})
				if (account) {
					saveToken(account, setToken, 'EMAIL')
					setEmail('')
				}
			} catch (e) {
				console.log('login error: ' + JSON.stringify(e))
				if (e instanceof RPCError) {
					switch (e.code) {
						case RPCErrorCode.MagicLinkFailedVerification:
						case RPCErrorCode.MagicLinkExpired:
						case RPCErrorCode.MagicLinkRateLimited:
						case RPCErrorCode.UserAlreadyLoggedIn:
							showToast({message: e.message, type: 'error'})
							break
						default:
							showToast({
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

	return (
		<Card>
			<CardHeader id='login'>Email OTP Login</CardHeader>
			<div className='flex flex-col items-center justify-center'>
				<input
					onChange={(e) => {
						if (emailError) setEmailError(false)
						setEmail(e.target.value)
					}}
					placeholder={
						token.length > 0 ? 'Already logged in' : 'Email'
					}
					value={email}
					className='p-2 border-solid border-[1px] border-[#A799FF] rounded-lg w-full mt-2'
					disabled={token.length > 0}
				/>
				{emailError && (
					<span className='self-start text-xs font-semibold text-red-700 justify-self-start'>
						Enter a valid email
					</span>
				)}
				<button
					className={classNames(
						'w-full rounded-3xl px-8 py-2 bg-[#A799FF] enabled:hover:bg-[#A799FF]/[0.5] text-center text-white font-medium disabled:cursor-default cursor-pointer my-2 items-center justify-center'
					)}
					disabled={
						isLoginInProgress ||
						(token.length > 0 ? false : email.length == 0)
					}
					onClick={() => handleLogin()}>
					{isLoginInProgress ? <Spinner /> : 'Login'}
				</button>
			</div>
		</Card>
	)
}

export default EmailOTP
