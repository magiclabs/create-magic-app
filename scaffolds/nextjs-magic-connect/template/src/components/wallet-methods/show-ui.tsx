import React, { useCallback, useState } from "react"
import Loading from "public/loading.svg"
import ErrorText from "../ui/error"
import Spacer from "../ui/spacer"
import { useMagicContext } from "@/context/magic-context"
import Image from "next/image"

const ShowUI = () => {
  const { magic } = useMagicContext()
  const [disabled, setDisabled] = useState(false)
  const [showUIError, setShowUIError] = useState(false)

  const showUI = useCallback(async () => {
    if (!magic) return
    try {
      setShowUIError(false)
      const { walletType } = await magic.wallet.getInfo()
      if (walletType !== "magic") {
        return setShowUIError(true)
      }
      setDisabled(true)
      await magic.wallet.showUI()
      setDisabled(false)
    } catch (error) {
      setDisabled(false)
      console.error(error)
    }
  }, [magic])

  return (
    <div className="wallet-method-container">
      <button className="wallet-method" onClick={showUI} disabled={disabled}>
        {disabled ? (
          <div className="loadingContainer" style={{ width: "76px" }}>
            <Image className="loading" alt="loading" src={Loading} />
          </div>
        ) : (
          "showUI()"
        )}
      </button>
      <div className="wallet-method-desc">
        Opens wallet view to manage assets, purchase/send/receive crypto, and
        access recovery phrase.
      </div>
      {showUIError ? (
        <div style={{ marginBottom: "-10px" }}>
          <Spacer size={20} />
          <ErrorText>Method not supported for third party wallets.</ErrorText>
        </div>
      ) : null}
    </div>
  )
}

export default ShowUI
