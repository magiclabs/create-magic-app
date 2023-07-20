export const getChainIdFromUrl = (url: string) => {
	switch (url) {
		case 'https://polygon-rpc.com/':
			return 137
		case 'https://rpc-mumbai.maticvigil.com':
			return 80001
	}
}
