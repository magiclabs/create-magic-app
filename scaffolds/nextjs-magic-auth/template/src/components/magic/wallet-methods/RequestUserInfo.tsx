import React, { useCallback, useState } from 'react'
import showToast from '@/utils/showToast'
import { useMagic } from '../MagicProvider'
import Spinner from '@/components/ui/Spinner'

const RequestUserInfo = () => {
  const { magic } = useMagic()
  const [disabled, setDisabled] = useState(false)

  const requestUserInfo = useCallback(async () => {
    if (!magic) return
    try {
      setDisabled(true)
      const userInfo = await magic.wallet.requestUserInfoWithUI()
      setDisabled(false)
      showToast({ message: `Email: ${userInfo.email}`, type: 'success' })
    } catch (error) {
      setDisabled(false)
      console.error(error)
    }
  }, [magic])

  return (
    <div className="wallet-method-container">
      <button
        className="wallet-method"
        onClick={requestUserInfo}
        disabled={disabled}
      >
        {disabled ? (
          <div className="loadingContainer" style={{ width: '220px' }}>
            <Spinner />
          </div>
        ) : (
          'requestUserInfoWithUI()'
        )}
      </button>
      <div className="wallet-method-desc">
        Prompts the user to consent to sharing information with the requesting
        dApp.
      </div>
    </div>
  )
}

export default RequestUserInfo
