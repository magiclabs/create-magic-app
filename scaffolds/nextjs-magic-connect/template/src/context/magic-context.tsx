import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useState,
} from "react"
import { Magic } from "magic-sdk"
import { Networks, formattedNetwork } from "../utils/networks"
import Web3 from "web3"

export type MagicContextType = {
  magic: Magic | null
  web3: Web3 | null
  updateMagicInstance: (network: Networks) => void
  selectedNetwork: Networks | null
}

const MagicContext = createContext<MagicContextType>({
  magic: null,
  web3: null,
  updateMagicInstance: () => {},
  selectedNetwork: null,
})

export const useMagicContext = () => useContext(MagicContext)

const MagicProvider = ({ children }: { children: React.ReactNode }) => {
  const [magicInstance, setMagicInstance] = useState<Magic | null>(null)
  const [web3Instance, setWeb3Instance] = useState<Web3 | null>(null)
  const [selectedNetwork, setSelectedNetwork] = useState<Networks | null>(null)

  const updateMagicInstance = useCallback((network: Networks) => {
    setSelectedNetwork(network)
    const magic = new Magic(process.env.NEXT_PUBLIC_MAGIC_API_KEY as string, {
      network: formattedNetwork(network),
    })
    setMagicInstance(magic)
    setWeb3Instance(new Web3((magic as any).rpcProvider))
  }, [])

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedNetwork =
        (localStorage.getItem("network") as Networks | null) ||
        Networks.Ethereum
      setSelectedNetwork(storedNetwork)
      updateMagicInstance(storedNetwork)
    }
  }, [updateMagicInstance])

  return (
    <MagicContext.Provider
      value={{
        magic: magicInstance,
        web3: web3Instance,
        updateMagicInstance,
        selectedNetwork,
      }}
    >
      {children}
    </MagicContext.Provider>
  )
}

export default MagicProvider
