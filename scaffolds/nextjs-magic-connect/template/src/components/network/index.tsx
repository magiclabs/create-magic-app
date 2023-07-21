import React, { useCallback, useState } from "react"
import DownArrow from "public/down-arrow.svg"
import Check from "public/check.svg"
import { Networks } from "../../utils/networks"
import Image from "next/image"
import { useMagicContext } from "@/context/magic-context"

const Network = () => {
  const networkOptions = [
    Networks.Ethereum,
    Networks.Polygon,
    Networks.Optimism,
  ]
  const [isOpen, setIsOpen] = useState(false)
  const { selectedNetwork, updateMagicInstance } = useMagicContext()

  const handleNetworkSelected = useCallback(
    (networkOption: Networks) => {
      if (networkOption !== selectedNetwork) {
        localStorage.setItem("network", networkOption)
        updateMagicInstance(networkOption)
        console.log("SELECTED NETWORK: ", networkOption)
      }
    },
    [selectedNetwork, updateMagicInstance]
  )

  const toggleDropdown = () => setIsOpen(!isOpen)

  return (
    <div className="network-dropdown" onClick={toggleDropdown}>
      <div className="active-network">
        {selectedNetwork}
        <Image
          src={DownArrow}
          alt="down-arrow"
          className={isOpen ? "rotate" : ""}
        />
      </div>
      {isOpen && (
        <div className="network-options">
          {networkOptions.map((networkOption) => (
            <div
              key={networkOption}
              className="network-dropdown-option"
              onClick={() => handleNetworkSelected(networkOption)}
            >
              <Image src={Check} alt="check" style={{ marginRight: "10px" }} />
              {networkOption}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Network
