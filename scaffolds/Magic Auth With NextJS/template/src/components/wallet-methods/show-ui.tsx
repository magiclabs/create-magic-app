import React, {useCallback, useState} from 'react'
import ErrorText from '../ui/error'
import Spacer from '../ui/spacer'
import Image from 'next/image'
import {useMagic} from '../provider/MagicProvider'
import Spinner from '../ui/Spinner'

const ShowUI = () => {
	const {magic} = useMagic()
	const [disabled, setDisabled] = useState(false)
	const [showUIError, setShowUIError] = useState(false)

	const showUI = useCallback(async () => {
		if (!magic) return
		try {
			setShowUIError(false)
			const {walletType} = await magic.wallet.getInfo()
			if (walletType !== 'magic') {
				return setShowUIError(true)
			}
			setDisabled(true)
			await magic.wallet.showUI()
			setDisabled(false)
		} catch (error) {
			setDisabled(false)
			console.error(error)
		}
	}, [magic])

	return (
		<div className='wallet-method-container'>
			<button
				className='wallet-method'
				onClick={showUI}
				disabled={disabled}>
				{disabled ? (
					<div className='loadingContainer' style={{width: '76px'}}>
						<Spinner />
					</div>
				) : (
					'showUI()'
				)}
			</button>
			<div className='wallet-method-desc'>
				Opens wallet view to manage assets, purchase/send/receive
				crypto, and access recovery phrase.
			</div>
			{showUIError ? (
				<div style={{marginBottom: '-10px'}}>
					<Spacer size={20} />
					<ErrorText>
						Method not supported for third party wallets.
					</ErrorText>
				</div>
			) : null}
		</div>
	)
}

export default ShowUI
