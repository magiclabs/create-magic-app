import { Dispatch, SetStateAction } from 'react'

export type LoginProps = {
  token: string
  setToken: Dispatch<SetStateAction<string>>
}

export type TxnParams = {
  from: string | null;
  to: string | null;
  value: string;
  maxFeePerGas?: bigint;
  maxPriorityFeePerGas?: bigint;
  gasPrice?: string;
};



export type { Magic } from '../components/magic/MagicProvider'
