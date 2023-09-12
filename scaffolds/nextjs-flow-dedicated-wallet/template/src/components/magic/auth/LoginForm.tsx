import {LoginProps} from '@/utils/types'
import {useEffect, useMemo, useState} from 'react'
import {saveToken} from '@/utils/common'
import Spinner from '../../ui/Spinner'
import {useRouter} from 'next/router'
import Card from '../../ui/Card'
import CardHeader from '../../ui/CardHeader'

const setScriptAttributesAndAddScript = (src: string) => {
	const script = document.createElement('script')
	script.src = src
	script.setAttribute(
		'data-magic-publishable-api-key',
		process.env.NEXT_PUBLIC_MAGIC_API_KEY!
	)
	script.setAttribute('data-redirect-uri', '/')
	script.async = true

	document.body.appendChild(script)
}

const LoginForm = ({token, setToken}: LoginProps) => {
	const router = useRouter()
	const [isLoginInProgress, setLoginInProgress] = useState(false)

	useMemo(async () => {
		if (token.length == 0 && router.query) {
			if (router.query.didt) {
				await saveToken(router.query.didt as string, setToken, 'FORM')
				router.replace('/', undefined, {shallow: true})
			}
			if (router.query.magic_credential) {
				await saveToken(
					router.query.magic_credential as string,
					setToken,
					'FORM'
				)
				router.replace('/', undefined, {shallow: true})
			}
		}
	}, [router, setToken, token.length])

	useEffect(() => {
		if (token.length > 0 && !isLoginInProgress) {
			setLoginInProgress(false)
		}
	}, [token, setLoginInProgress, isLoginInProgress])

	const handleLogin = () => {
		setLoginInProgress(true)
		setScriptAttributesAndAddScript('https://auth.magic.link/pnp/login')
	}

	return (
		<Card>
			<CardHeader id='login'>Login Form</CardHeader>
			<button
				className='login-button'
				disabled={isLoginInProgress}
				onClick={() => handleLogin()}>
				{isLoginInProgress ? <Spinner /> : 'Login'}
			</button>
			<span className='text-xs mt-2'>
				Please wait a few seconds after clicking login as this button is
				executing a magic script
			</span>
		</Card>
	)
}

export default LoginForm
