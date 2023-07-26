import React, {useCallback, useState} from 'react'
import showToast from '@/utils/showToast'
import {useMagic} from '../MagicProvider'
import Spinner from '@/components/ui/Spinner'

const GetMetadata = () => {
	const {magic} = useMagic()
	const [disabled, setDisabled] = useState(false)

	const getMetadata = useCallback(async () => {
		if (!magic) return
		try {
			setDisabled(true)
			const userInfo = await magic.user.getMetadata()
			setDisabled(false)
			showToast({
				message: `Public Address: ${userInfo.publicAddress}`,
				type: 'success',
			})
		} catch (error) {
			setDisabled(false)
			console.error(error)
		}
	}, [magic])

	return (
		<div className='wallet-method-container'>
			<button
				className='wallet-method'
				onClick={getMetadata}
				disabled={disabled}>
				{disabled ? (
					<div className='loadingContainer' style={{width: '220px'}}>
						<Spinner />
					</div>
				) : (
					'getMetadata()'
				)}
			</button>
			<div className='wallet-method-desc'>
				Retrieves information for the authenticated user.
			</div>
		</div>
	)
}

export default GetMetadata
