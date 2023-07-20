import React, {useCallback, useState} from 'react'
import Image from 'next/image'
import {useMagic} from '../provider/MagicProvider'
import Toast from '@/utils/Toast'
import Spinner from '../ui/Spinner'

const GetWalletInfo = () => {
	const {magic} = useMagic()
	const [disabled, setDisabled] = useState(false)
	const [showToast, setShowToast] = useState(false)
	const [walletType, setWalletType] = useState('')

	const getWalletType = useCallback(async () => {
		if (!magic) return
		try {
			setDisabled(true)
			const walletInfo = await magic.wallet.getInfo()
			setDisabled(false)
			setWalletType(walletInfo.walletType)
			Toast({message: `Wallet type: ${walletType}`, type: 'success'})
			setTimeout(() => {
				setShowToast(false)
			}, 3000)
		} catch (error) {
			setDisabled(false)
			console.error(error)
		}
	}, [magic])

	return (
		<div className='wallet-method-container'>
			<button
				className='wallet-method'
				onClick={getWalletType}
				disabled={disabled}>
				{disabled ? (
					<div className='loadingContainer' style={{width: '86px'}}>
						<Spinner />
					</div>
				) : (
					'getInfo()'
				)}
			</button>
			<div className='wallet-method-desc'>
				Returns information about the logged in user&apos;s wallet.
			</div>
		</div>
	)
}

export default GetWalletInfo
