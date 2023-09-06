import React from 'react'
import TableOfContents from '../ui/TableOfContents'
import AppHeader from '../ui/AppHeader'
import Wallet from './cards/UserInfoCard'
import WalletMethods from './cards/WalletMethodsCard'
import SendTransaction from './cards/SendTransactionsCard'
import Links from './Links'
import Spacer from '../ui/Spacer'

interface Props {
	setAccount: React.Dispatch<React.SetStateAction<string | null>>
}

export default function Home({setAccount}: Props) {
	return (
		<div className='home-page'>
			<AppHeader />
			<Spacer size={32} />
			<Links />
			<Spacer size={120} />
			<TableOfContents />
			<div className='mt-[-250px]'>
				<SendTransaction />
				<Wallet setAccount={setAccount} />
				<WalletMethods setAccount={setAccount} />
				<Spacer size={15} />
				<Links dark />
				<Spacer size={30} />
			</div>
		</div>
	)
}
