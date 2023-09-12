import React, {useState} from 'react'
import Disconnect from '../wallet-methods/Disconnect'
import Divider from '@/components/ui/Divider'
import {LoginProps} from '@/utils/types'
import Card from '@/components/ui/Card'
import CardHeader from '@/components/ui/CardHeader'
import {LoginMethod} from '@/utils/common'
import GetIdToken from '../wallet-methods/GetIdToken'
import GetMetadata from '../wallet-methods/GetMetadata'
<% if(loginMethods.map(authType => authType.replaceAll(" ", "")).includes("EmailOTP")){%>
<%-`import UpdateEmail from '../wallet-methods/UpdateEmail'`-%>
<% }%>
<% if(loginMethods.map(authType => authType.replaceAll(" ", "")).includes("SMSOTP")){%>
<%-`import UpdatePhone from '../wallet-methods/UpdatePhone'`-%>
<% }%>

const WalletMethods = ({token, setToken}: LoginProps) => {
	const [loginMethod, setLoginMethod] = useState<LoginMethod | null>(
		localStorage.getItem('loginMethod') as LoginMethod
	)
	return (
		<Card>
			<CardHeader id='methods'>Wallet Methods</CardHeader>
			<% if(loginMethods.map(authType => authType.replaceAll(" ", "")).includes("EmailOTP")){%>
				<%-`{loginMethod && loginMethod == 'EMAIL' && (
					<>
						<UpdateEmail />
						<Divider />
					</>
				)}`-%>
			<% }%>
			<% if(loginMethods.map(authType => authType.replaceAll(" ", "")).includes("SMSOTP")){%>
				<%-`{loginMethod && loginMethod == 'SMS' && (
					<>
						<UpdatePhone />
						<Divider />
					</>
				)}`-%>
			<% }%>
			<GetIdToken />
			<Divider />
			<GetMetadata />
			<Divider />
			<Disconnect token={token} setToken={setToken} />
		</Card>
	)
}

export default WalletMethods
