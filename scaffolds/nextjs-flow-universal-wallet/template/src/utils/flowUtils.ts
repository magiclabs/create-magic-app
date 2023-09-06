export const convertAccountBalance = (amount: number) => {
	return (amount / 10 ** 8).toString()
}
