import React from 'react'
import Disconnect from './disconnect'
import GetWalletInfo from './get-info'
import RequestUserInfo from './request-user-info'
import ShowUI from './show-ui'
import Divider from '../ui/divider'
import {LoginProps} from '@/utils/types'
import Card from '../ui/card'
import CardHeader from '../ui/card-header'

const WalletMethods = ({token, setToken}: LoginProps) => {
	return (
		<Card>
			<CardHeader id='methods'>Wallet Methods</CardHeader>
			<ShowUI />
			<Divider />
			<GetWalletInfo />
			<Divider />
			<RequestUserInfo />
			<Divider />
			<Disconnect token={token} setToken={setToken} />
		</Card>
	)
}

export default WalletMethods
