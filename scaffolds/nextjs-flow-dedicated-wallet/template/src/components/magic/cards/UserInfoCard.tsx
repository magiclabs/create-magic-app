import {useCallback, useEffect, useState} from 'react'
import Divider from '@/components/ui/Divider'
import {LoginProps} from '@/utils/types'
import {logout} from '@/utils/common'
import {useMagic} from '../MagicProvider'
import Card from '@/components/ui/Card'
import CardHeader from '@/components/ui/CardHeader'
import CardLabel from '@/components/ui/CardLabel'
import Spinner from '@/components/ui/Spinner'
import {getNetworkName} from '@/utils/network'
import {convertAccountBalance} from '@/utils/flowUtils'
import * as fcl from '@onflow/fcl'

const UserInfo = ({token, setToken}: LoginProps) => {
	const {magic} = useMagic()

	const [balance, setBalance] = useState('...')
	const [copied, setCopied] = useState('Copy')
	const [isRefreshing, setIsRefreshing] = useState(false)

	const [publicAddress, setPublicAddress] = useState(
		localStorage.getItem('user')
	)

	useEffect(() => {
		const checkLoginandGetBalance = async () => {
			const isLoggedIn = await magic?.user.isLoggedIn()
			if (isLoggedIn) {
				try {
					const metadata = await magic?.user.getInfo()
					if (metadata) {
						localStorage.setItem('user', metadata?.publicAddress!)
						setPublicAddress(metadata?.publicAddress!)
					}
				} catch (e) {
					console.log('error in fetching address: ' + e)
				}
			}
		}
		setTimeout(() => checkLoginandGetBalance(), 5000)
	}, [])

	const getBalance = useCallback(async () => {
		if (publicAddress) {
			const account = await fcl.account(publicAddress)
			setBalance(convertAccountBalance(account.balance))
		}
	}, [magic, publicAddress])

	const refresh = useCallback(async () => {
		setIsRefreshing(true)
		await getBalance()
		setTimeout(() => {
			setIsRefreshing(false)
		}, 500)
	}, [getBalance])

	useEffect(() => {
		if (magic) {
			refresh()
		}
	}, [magic, refresh])

	useEffect(() => {
		setBalance('...')
	}, [magic])

	const disconnect = useCallback(async () => {
		if (magic) {
			await logout(setToken, magic)
		}
	}, [magic, setToken])

	const copy = useCallback(() => {
		if (publicAddress && copied === 'Copy') {
			setCopied('Copied!')
			navigator.clipboard.writeText(publicAddress)
			setTimeout(() => {
				setCopied('Copy')
			}, 1000)
		}
	}, [copied, publicAddress])

	return (
		<Card>
			<CardHeader id='Wallet'>Wallet</CardHeader>
			<CardLabel
				leftHeader='Status'
				rightAction={<div onClick={disconnect}>Disconnect</div>}
				isDisconnect
			/>
			<div className='flex-row'>
				<div className='green-dot' />
				<div className='connected'>Connected to {getNetworkName()}</div>
			</div>
			<Divider />
			<CardLabel
				leftHeader='Address'
				rightAction={
					!publicAddress ? (
						<Spinner />
					) : (
						<div onClick={copy}>{copied}</div>
					)
				}
			/>
			<div className='code'>
				{publicAddress?.length == 0
					? 'Fetching address..'
					: publicAddress}
			</div>
			<Divider />
			<CardLabel
				leftHeader='Balance'
				rightAction={
					isRefreshing ? (
						<div className='loading-container'>
							<Spinner />
						</div>
					) : (
						<div onClick={refresh}>Refresh</div>
					)
				}
			/>
			<div className='code'>{balance} FLOW</div>
		</Card>
	)
}

export default UserInfo
