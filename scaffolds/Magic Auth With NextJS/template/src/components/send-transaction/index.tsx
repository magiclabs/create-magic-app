import React, {useCallback, useEffect, useState} from 'react'
import Image from 'next/image'
import Divider from '../ui/divider'
import {useMagic} from '../provider/MagicProvider'
import FormButton from '../ui/form-button'
import FormInput from '../ui/form-input'
import ErrorText from '../ui/error'
import Card from '../ui/card'
import CardHeader from '../ui/card-header'

const SendTransaction = () => {
	const {web3} = useMagic()
	const [toAddress, setToAddress] = useState('')
	const [amount, setAmount] = useState('')
	const [disabled, setDisabled] = useState(!toAddress || !amount)
	const [hash, setHash] = useState('')
	const [toAddressError, setToAddressError] = useState(false)
	const [amountError, setAmountError] = useState(false)
	const publicAddress = localStorage.getItem('user')

	useEffect(() => {
		setDisabled(!toAddress || !amount)
		setAmountError(false)
		setToAddressError(false)
	}, [amount, toAddress])

	const sendTransaction = useCallback(() => {
		if (!web3?.utils.isAddress(toAddress)) {
			return setToAddressError(true)
		}
		if (isNaN(Number(amount))) {
			return setAmountError(true)
		}
		setDisabled(true)
		const txnParams = {
			from: publicAddress,
			to: toAddress,
			value: web3.utils.toWei(amount, 'ether'),
			gas: 21000,
		}
		web3.eth
			.sendTransaction(txnParams as any)
			.on('transactionHash', (txHash) => {
				setHash(txHash)
				console.log('Transaction hash:', txHash)
			})
			.then((receipt) => {
				setToAddress('')
				setAmount('')
				console.log('Transaction receipt:', receipt)
			})
			.catch((error) => {
				console.error(error)
				setDisabled(false)
			})
	}, [web3, amount, publicAddress, toAddress])

	return (
		<Card>
			<CardHeader id='send-transaction'>Send Transaction</CardHeader>
			<a
				href='https://faucet.polygon.technology/'
				target='_blank'
				rel='noreferrer'>
				<FormButton onClick={() => null} disabled={false}>
					Get Test Matic
				</FormButton>
			</a>
			<Divider />
			<FormInput
				value={toAddress}
				onChange={(e: any) => setToAddress(e.target.value)}
				placeholder='Receiving Address'
			/>
			{toAddressError ? <ErrorText>Invalid address</ErrorText> : null}
			<FormInput
				value={amount}
				onChange={(e: any) => setAmount(e.target.value)}
				placeholder={`Amount (MATIC)`}
			/>
			{amountError ? (
				<ErrorText className='error'>Invalid amount</ErrorText>
			) : null}
			<FormButton
				onClick={sendTransaction}
				disabled={!toAddress || !amount || disabled}>
				Send Transaction
			</FormButton>
		</Card>
	)
}

export default SendTransaction
