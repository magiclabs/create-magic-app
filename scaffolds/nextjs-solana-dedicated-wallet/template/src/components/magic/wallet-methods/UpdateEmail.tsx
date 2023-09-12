import React, {useCallback, useState} from 'react'
import ErrorText from '@/components/ui/ErrorText'
import Spacer from '@/components/ui/Spacer'
import {useMagic} from '../MagicProvider'
import Spinner from '@/components/ui/Spinner'
import FormInput from '@/components/ui/FormInput'
import showToast from '@/utils/showToast'
import {RPCError} from 'magic-sdk'

const UpdateEmail = () => {
	const {magic} = useMagic()
	const [disabled, setDisabled] = useState(false)
	const [email, setEmail] = useState('')
	const [emailError, setEmailError] = useState(false)

	const updateEmail = useCallback(async () => {
		if (!magic) return
		try {
			if (
				!email.match(
					/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
				)
			) {
				setEmailError(true)
				setDisabled(false)
			} else {
				setDisabled(true)
				await magic.auth.updateEmailWithUI({email, showUI: true})
				showToast({message: 'Email Updated!', type: 'success'})
				setDisabled(false)
				setEmail('')
			}
		} catch (error) {
			setDisabled(false)
			console.error(error)
			if (error instanceof RPCError) {
				showToast({message: error.message, type: 'error'})
			} else {
				showToast({message: 'Update email failed', type: 'error'})
			}
		}
	}, [magic, email])

	const handleEmailChange = (e: any) => {
		setEmailError(false)
		setEmail(e.target.value)
	}

	return (
		<div className='wallet-method-container'>
			<FormInput
				value={email}
				onChange={handleEmailChange}
				placeholder='New Email'
			/>
			<button
				className='wallet-method'
				onClick={updateEmail}
				disabled={disabled}>
				{disabled ? (
					<div className='loading-container w-[76px]'>
						<Spinner />
					</div>
				) : (
					'updateEmail()'
				)}
			</button>
			<div className='wallet-method-desc'>
				Initiates the update email flow that allows a user to change
				their email address.
			</div>
			{emailError ? (
				<div className='mb-[-10px]'>
					<Spacer size={20} />
					<ErrorText>Enter a valid email!</ErrorText>
				</div>
			) : null}
		</div>
	)
}

export default UpdateEmail
