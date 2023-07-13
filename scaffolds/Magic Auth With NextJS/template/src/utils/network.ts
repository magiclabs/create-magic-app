export type NetworkOption = {
	value: string
	rpcUrl: string
	chainId: number
}

export enum Network {
	POLY_MAINNET = 'Polygon (Mainnet)',
	POLY_TESTNET = 'Polygon (Testnet)',
}

export const getFormattedNetwork = (network: string): NetworkOption => {
	switch (network) {
		case Network.POLY_MAINNET:
			return {
				value: Network.POLY_MAINNET,
				rpcUrl: 'https://polygon-rpc.com/',
				chainId: 137,
			}
		case Network.POLY_TESTNET:
			return {
				value: Network.POLY_TESTNET,
				rpcUrl: 'https://rpc-mumbai.maticvigil.com',
				chainId: 80001,
			}

		default:
			return {
				value: Network.POLY_TESTNET,
				rpcUrl: 'https://rpc-mumbai.maticvigil.com',
				chainId: 80001,
			}
	}
}
