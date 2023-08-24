import React, {useCallback, useState} from 'react'
import {useMagic} from '../MagicProvider'
import Spinner from '@/components/ui/Spinner'
import showToast from '@/utils/showToast'
import {RPCError} from 'magic-sdk'

const UpdatePhone = () => {
	const {magic} = useMagic()
	const [disabled, setDisabled] = useState(false)

	const updatePhone = useCallback(async () => {
		if (!magic) return
		try {
			setDisabled(true)
			await magic.auth.updatePhoneNumberWithUI()
			showToast({message: 'Phone Updated!', type: 'success'})
			setDisabled(false)
		} catch (error) {
			setDisabled(false)
			console.error(error)
			if (error instanceof RPCError) {
				showToast({message: error.message, type: 'error'})
			} else {
				showToast({message: 'Update phone failed', type: 'error'})
			}
		}
	}, [magic])

	return (
		<div className='wallet-method-container'>
			<button
				className='wallet-method'
				onClick={updatePhone}
				disabled={disabled}>
				{disabled ? (
					<div className='loadingContainer' style={{width: '76px'}}>
						<Spinner />
					</div>
				) : (
					'updatePhone()'
				)}
			</button>
			<div className='wallet-method-desc'>
				Initiates the update phone number flow that allows a user to
				change their phone number.
			</div>
		</div>
	)
}

export default UpdatePhone
