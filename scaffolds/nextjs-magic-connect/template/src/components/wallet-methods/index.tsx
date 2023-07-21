import React from "react"
import Disconnect from "./disconnect"
import GetWalletInfo from "./get-info"
import RequestUserInfo from "./request-user-info"
import ShowUI from "./show-ui"
import Divider from "../ui/divider"
import Card from "../ui/card"
import CardHeader from "../ui/card-header"

interface Props {
  setAccount: React.Dispatch<React.SetStateAction<string | null>>
}

const WalletMethods = ({ setAccount }: Props) => {
  return (
    <Card>
      <CardHeader id="wallet-methods">Wallet Methods</CardHeader>
      <ShowUI />
      <Divider />
      <GetWalletInfo />
      <Divider />
      <RequestUserInfo />
      <Divider />
      <Disconnect setAccount={setAccount} />
    </Card>
  )
}

export default WalletMethods
