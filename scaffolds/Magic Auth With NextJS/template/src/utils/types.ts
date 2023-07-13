import {Dispatch, SetStateAction} from 'react'

export type LoginProps = {
	token: string
	setToken: Dispatch<SetStateAction<string>>
}
