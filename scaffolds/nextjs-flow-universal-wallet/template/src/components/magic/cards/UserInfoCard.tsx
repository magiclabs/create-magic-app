import {useCallback, useEffect, useState} from 'react'
import Image from 'next/image'
import Divider from '../../ui/Divider'
import Loading from 'public/loading.svg'
import CardLabel from '../../ui/CardLabel'
import Card from '../../ui/Card'
import CardHeader from '../../ui/CardHeader'
import {useMagicContext} from '@/components/magic/MagicProvider'
import {getNetworkName} from '@/utils/networks'
import * as fcl from '@onflow/fcl'
import {convertAccountBalance} from '@/utils/flowUtils'

interface Props {
	setAccount: React.Dispatch<React.SetStateAction<string | null>>
}

const UserInfo = ({setAccount}: Props) => {
	const {magic} = useMagicContext()

	const [balance, setBalance] = useState('...')
	const [copied, setCopied] = useState('Copy')
	const [isRefreshing, setIsRefreshing] = useState(false)

	const publicAddress = localStorage.getItem('user')

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
			await magic.wallet.disconnect()
			localStorage.removeItem('user')
			setAccount(null)
		}
	}, [magic, setAccount])

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
			<CardHeader id='wallet'>Wallet</CardHeader>
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
				rightAction={<div onClick={copy}>{copied}</div>}
			/>
			<div className='code'>{publicAddress}</div>
			<Divider />
			<CardLabel
				leftHeader='Balance'
				rightAction={
					isRefreshing ? (
						<div className='loading-container'>
							<Image
								className='loading'
								alt='loading'
								src={Loading}
							/>
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
