import React from "react"
import TableOfContents from "../table-of-contents"
import AppHeader from "../app-header"
import Wallet from "../wallet"
import WalletMethods from "../wallet-methods"
import SendTransaction from "../send-transaction"
import Links from "../links"
import Spacer from "../ui/spacer"
import HomePageBackground from "public/main.svg"
interface Props {
  setAccount: React.Dispatch<React.SetStateAction<string | null>>
}

export default function Home({ setAccount }: Props) {
  return (
    <div
      className="home-page"
      style={{
        backgroundImage: `url(${HomePageBackground})`,
      }}
    >
      <AppHeader />
      <Spacer size={32} />
      <Links />
      <Spacer size={120} />
      <TableOfContents />
      <div className="cards-container">
        <Wallet setAccount={setAccount} />
        <SendTransaction />
        <WalletMethods setAccount={setAccount} />
        <Spacer size={15} />
        <Links dark />
        <Spacer size={30} />
      </div>
    </div>
  )
}
