import React, { useCallback, useState } from 'react'
import { useMagic } from '../MagicProvider'
import showToast from '@/utils/showToast'
import Spinner from '@/components/ui/Spinner'

const GetWalletInfo = () => {
  const { magic } = useMagic()
  const [disabled, setDisabled] = useState(false)

  const getWalletType = useCallback(async () => {
    if (!magic) return
    try {
      setDisabled(true)
      const walletInfo = await magic.wallet.getInfo()
      setDisabled(false)
      showToast({
        message: `Wallet type: ${walletInfo.walletType}`,
        type: 'success',
      })
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
          <div className="loadingContainer" style={{ width: '86px' }}>
            <Spinner />
          </div>
        ) : (
          'getInfo()'
        )}
      </button>
      <div className="wallet-method-desc">
        Returns information about the logged in user&apos;s wallet.
      </div>
    </div>
  )
}

export default GetWalletInfo
