import {Magic} from 'magic-sdk'
import {Dispatch, SetStateAction} from 'react'

export const logout = (
	setToken: Dispatch<SetStateAction<string>>,
	magic: Magic | null
) => {
	;(async () => {
		if (await magic?.user.isLoggedIn()) {
			await magic?.user.logout()
		}
	})()
	localStorage.setItem('token', '')
	localStorage.setItem('user', '')
	setToken('')
}

export const saveToken = (
	token: string,
	setToken: Dispatch<SetStateAction<string>>
) => {
	localStorage.setItem('token', token)
	setToken(token)
	localStorage.setItem('isAuthLoading', 'false')
}
