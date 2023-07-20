import React, {useCallback, useState} from 'react'

import Image from 'next/image'
import {useMagic} from '../provider/MagicProvider'
import Toast from '@/utils/Toast'
import Spinner from '../ui/Spinner'

const RequestUserInfo = () => {
	const {magic} = useMagic()
	const [disabled, setDisabled] = useState(false)
	const [showToast, setShowToast] = useState(false)
	const [email, setEmail] = useState<string | undefined>('')

	const requestUserInfo = useCallback(async () => {
		if (!magic) return
		try {
			setDisabled(true)
			const userInfo = await magic.wallet.requestUserInfoWithUI()
			setDisabled(false)
			setEmail(userInfo.email)
			Toast({message: `Email: ${userInfo.email}`, type: 'success'})
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
				onClick={requestUserInfo}
				disabled={disabled}>
				{disabled ? (
					<div className='loadingContainer' style={{width: '220px'}}>
						<Spinner />
					</div>
				) : (
					'requestUserInfoWithUI()'
				)}
			</button>
			<div className='wallet-method-desc'>
				Prompts the user to consent to sharing information with the
				requesting dApp.
			</div>
		</div>
	)
}

export default RequestUserInfo
