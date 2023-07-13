import React, { useState, useCallback } from "react"
import AppHeader from "../app-header"
import Links from "../links"
import Network from "../network"
import ConnectButton from "../ui/connect-button"
import Spacer from "../ui/spacer"
import LoginPageBackground from "public/login.svg"
import { useMagicContext } from "@/context/magic-context"

interface Props {
  setAccount: React.Dispatch<React.SetStateAction<string | null>>
}

const Login = ({ setAccount }: Props) => {
  const [disabled, setDisabled] = useState(false)
  const { magic } = useMagicContext()

  const connect = useCallback(async () => {
    if (!magic) return
    try {
      setDisabled(true)
      const accounts = await magic.wallet.connectWithUI()
      setDisabled(false)
      console.log("Logged in user:", accounts[0])
      localStorage.setItem("user", accounts[0])
      setAccount(accounts[0])
    } catch (error) {
      setDisabled(false)
      console.error(error)
    }
  }, [magic, setAccount])

  return (
    <div
      className="login-page"
      style={{
        backgroundImage: `url(${LoginPageBackground})`,
      }}
    >
      <AppHeader />
      <Spacer size={32} />
      <Network />
      <Spacer size={20} />
      <ConnectButton onClick={connect} disabled={disabled} />
      <Links footer />
    </div>
  )
}

export default Login
