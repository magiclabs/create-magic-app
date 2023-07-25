import {EthNetworkConfiguration} from 'magic-sdk'

export enum Networks {
	Ethereum = 'Ethereum (Goerli)',
	Polygon = 'Polygon (Mumbai)',
	Optimism = 'Optimism (Goerli)',
}

export const formattedNetwork = (
	selectedNetwork: Networks
): EthNetworkConfiguration => {
	switch (selectedNetwork) {
		case Networks.Optimism:
			return {
				rpcUrl: process.env.NEXT_PUBLIC_OPTIMISM_RPC_URL as string,
				chainId: 420,
			}
		case Networks.Polygon:
			return {
				rpcUrl: process.env.NEXT_PUBLIC_POLYGON_RPC_URL as string,
				chainId: 80001,
			}
		default:
			return {
				rpcUrl: process.env.NEXT_PUBLIC_ETHEREUM_RPC_URL as string,
				chainId: 5,
			}
	}
}
