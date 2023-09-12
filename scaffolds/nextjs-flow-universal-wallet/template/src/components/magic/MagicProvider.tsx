import {createContext, useContext, useEffect, useMemo, useState} from 'react'
import {Magic as MagicBase} from 'magic-sdk'
import {getNetwork, getNetworkUrl} from '../../utils/networks'
import {FlowExtension} from '@magic-ext/flow'
import * as fcl from '@onflow/fcl'

export type Magic = MagicBase<FlowExtension[]>

export type MagicContextType = {
	magic: Magic | null
}

const MagicContext = createContext<MagicContextType>({
	magic: null,
})

export const useMagicContext = () => useContext(MagicContext)

const MagicProvider = ({children}: {children: React.ReactNode}) => {
	const [magicInstance, setMagicInstance] = useState<Magic | null>(null)

	useEffect(() => {
		if (process.env.NEXT_PUBLIC_MAGIC_API_KEY) {
			const magic = new MagicBase(
				process.env.NEXT_PUBLIC_MAGIC_API_KEY as string,
				{
					extensions: [
						new FlowExtension({
							rpcUrl: getNetworkUrl(),
							network: getNetwork() as string,
						}),
					],
				}
			)
			setMagicInstance(magic)
			fcl.config().put('accessNode.api', getNetworkUrl())
		}
	}, [])

	const value = useMemo(
		() => ({
			magic: magicInstance,
		}),
		[magicInstance]
	)

	return (
		<MagicContext.Provider value={value}>{children}</MagicContext.Provider>
	)
}

export default MagicProvider
