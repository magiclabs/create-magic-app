import React, { useCallback, useState } from "react"
import Loading from "public/loading.svg"
import Toast from "../ui/toast"
import { useMagicContext } from "@/context/magic-context"
import Image from "next/image"

const GetWalletInfo = () => {
  const { magic } = useMagicContext()
  const [disabled, setDisabled] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [walletType, setWalletType] = useState("")

  const getWalletType = useCallback(async () => {
    if (!magic) return
    try {
      setDisabled(true)
      const walletInfo = await magic.wallet.getInfo()
      setDisabled(false)
      setWalletType(walletInfo.walletType)
      setShowToast(true)
      setTimeout(() => {
        setShowToast(false)
      }, 3000)
    } catch (error) {
      setDisabled(false)
      console.error(error)
    }
  }, [magic])

  return (
    <div className="wallet-method-container">
      <button
        className="wallet-method"
        onClick={getWalletType}
        disabled={disabled}
      >
        {disabled ? (
          <div className="loadingContainer" style={{ width: "86px" }}>
            <Image className="loading" alt="loading" src={Loading} />
          </div>
        ) : (
          "getInfo()"
        )}
      </button>
      <div className="wallet-method-desc">
        Returns information about the logged in user&apos;s wallet.
      </div>
      {showToast ? <Toast>Wallet type: {walletType}</Toast> : null}
    </div>
  )
}

export default GetWalletInfo
