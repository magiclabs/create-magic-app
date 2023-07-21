import React from 'react'
import Disconnect from '../wallet-methods/Disconnect'
import GetWalletInfo from '../wallet-methods/GetWalletInfo'
import RequestUserInfo from '../wallet-methods/RequestUserInfo'
import ShowWalletUI from '../wallet-methods/ShowWalletUI'
import Divider from '@/components/ui/Divider'
import { LoginProps } from '@/utils/types'
import Card from '@/components/ui/Card'
import CardHeader from '@/components/ui/CardHeader'

const WalletMethods = ({ token, setToken }: LoginProps) => {
  return (
    <Card>
      <CardHeader id="methods">Wallet Methods</CardHeader>
      <ShowWalletUI />
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
