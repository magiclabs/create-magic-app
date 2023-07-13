import {Network, NetworkOption, getFormattedNetwork} from '@/utils/network'
import Header from '../components/Header'
import MagicProvider, {useMagic} from '../components/provider/MagicProvider'
import Image from 'next/image'
import {useEffect, useState} from 'react'
import {ToastContainer} from 'react-toastify'
import LoginWithEmailOtp from '@/components/auth/LoginWithEmailOtp'
import LoginWithSms from '@/components/auth/LoginWithSms'
import 'react-toastify/dist/ReactToastify.css'
import SocialLogin from '@/components/auth/SocialLogin'

export default function Home() {
	const [token, setToken] = useState('')

	const [selectedNetwork, setSelectedNetwork] =
		useState<NetworkOption | null>(
			getFormattedNetwork(Network.POLY_TESTNET)
		)

	useEffect(() => {
		setToken(localStorage.getItem('token') ?? '')
	}, [setToken])

	return (
		<MagicProvider network={selectedNetwork}>
			<ToastContainer />
			<Header
				selectedNetwork={selectedNetwork}
				setSelectedNetwork={setSelectedNetwork}
				token={token}
				setToken={setToken}
			/>
			<div className='flex min-h-screen flex-col items-center'>
				<div className='w-[100%] grid grid-cols-6 gap-2 p-4'>
					<LoginWithEmailOtp token={token} setToken={setToken} />
					<LoginWithSms token={token} setToken={setToken} />
					<SocialLogin token={token} setToken={setToken} />
				</div>
			</div>
		</MagicProvider>
	)
}
