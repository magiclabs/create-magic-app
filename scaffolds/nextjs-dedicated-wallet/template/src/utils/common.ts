import { Magic } from './types';
import { Dispatch, SetStateAction } from 'react';

export type LoginMethod = 'EMAIL' | 'SMS' | 'SOCIAL' | 'FORM';

export const logout = async (setToken: Dispatch<SetStateAction<string>>, magic: Magic | null) => {
  if (await magic?.user.isLoggedIn()) {
    await magic?.user.logout();
  }
  localStorage.setItem('token', '');
  localStorage.setItem('user', '');
  setToken('');
};

export const saveToken = (token: string, setToken: Dispatch<SetStateAction<string>>, loginMethod: LoginMethod) => {
  localStorage.setItem('token', token);
  setToken(token);
  localStorage.setItem('isAuthLoading', 'false');
  localStorage.setItem('loginMethod', loginMethod);
};
