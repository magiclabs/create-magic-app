import Header from '../components/ui/Header'
import MagicProvider, {useMagic} from '../components/provider/MagicProvider'
import {useEffect, useMemo, useState} from 'react'
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import {useRouter} from 'next/router'
import Login from '@/components/ui/Login'
import Dashboard from '@/components/ui/Dashboard'

export default function Home() {
	const [token, setToken] = useState('')
	const router = useRouter()

	useEffect(() => {
		setToken(localStorage.getItem('token') ?? '')
	}, [setToken])

	return (
		<MagicProvider>
			<ToastContainer />
			<Header token={token} setToken={setToken} />
			{token.length > 0 ? (
				<Dashboard token={token} setToken={setToken} />
			) : (
				<Login token={token} setToken={setToken} />
			)}
		</MagicProvider>
	)
}
