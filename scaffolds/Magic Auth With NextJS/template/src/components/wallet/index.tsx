import {useCallback, useEffect, useMemo, useState} from 'react'
import Image from 'next/image'
import Divider from '../ui/divider'
import FormButton from '../ui/form-button'
import Link from 'public/link.svg'
import {LoginProps} from '@/utils/types'
import {logout} from '@/utils/common'
import {useMagic} from '../provider/MagicProvider'
import Card from '../ui/card'
import CardHeader from '../ui/card-header'
import CardLabel from '../ui/card-label'
import Spinner from '../ui/Spinner'

const UserInfo = ({token, setToken}: LoginProps) => {
	const {magic, web3} = useMagic()

	const [balance, setBalance] = useState('...')
	const [copied, setCopied] = useState('Copy')
	const [isRefreshing, setIsRefreshing] = useState(false)

	const [publicAddress, setPublicAddress] = useState(
		localStorage.getItem('user')
	)

	useMemo(async () => {
		if (await magic?.user.isLoggedIn()) {
			if (!publicAddress || !localStorage.getItem('user')) {
				try {
					const metadata = await magic?.user.getMetadata()
					if (metadata) {
						localStorage.setItem('user', metadata?.publicAddress!)
						setPublicAddress(metadata?.publicAddress!)
					}
				} catch (e) {
					console.log('error in fetching address: ' + e)
				}
			}
		}
	}, [token, magic])

	const getBalance = useCallback(async () => {
		if (publicAddress && web3) {
			const balance = await web3.eth.getBalance(publicAddress)
			setBalance(web3.utils.fromWei(balance, 'ether'))
			console.log('BALANCE: ', balance)
		}
	}, [web3, publicAddress])

	const refresh = useCallback(async () => {
		setIsRefreshing(true)
		await getBalance()
		setTimeout(() => {
			setIsRefreshing(false)
		}, 500)
	}, [getBalance])

	useEffect(() => {
		if (web3) {
			refresh()
		}
	}, [web3, refresh])

	useEffect(() => {
		setBalance('...')
	}, [magic])

	const disconnect = useCallback(async () => {
		if (magic) {
			logout(setToken, magic)
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
			<CardHeader id='Wallet'>Send Transaction</CardHeader>
			<CardLabel
				leftHeader='Status'
				rightAction={<div onClick={disconnect}>Disconnect</div>}
				isDisconnect
			/>
			<div className='flex-row'>
				<div className='green-dot' />
				<div className='connected'>Connected</div>
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
				style={{height: '20px'}}
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
			<div className='code'>{balance.substring(0, 7)} Matic</div>
		</Card>
	)
}

export default UserInfo
