import React, {useEffect, useMemo, useState} from 'react'
import WalletMethods from '../wallet-methods'
import SendTransaction from '../send-transaction'
import Spacer from './spacer'
import {LoginProps} from '@/utils/types'
import UserInfo from '../wallet'
import DevLinks from './dev-links'
import {useMagic} from '../provider/MagicProvider'

export default function Dashboard({token, setToken}: LoginProps) {
	return (
		<div className='home-page'>
			<Spacer size={32} />
			<Spacer size={120} />
			<div className='cards-container'>
				<UserInfo token={token} setToken={setToken} />
				<Spacer size={10} />
				<SendTransaction />
				<Spacer size={10} />
				<WalletMethods token={token} setToken={setToken} />
				<Spacer size={15} />
			</div>
			<DevLinks primary />
		</div>
	)
}
