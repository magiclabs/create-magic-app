import { magic } from "../lib/magic";

const isBrowser = typeof window !== `undefined`

export const isLoggedIn = () => {
  if (!isBrowser) return false

  return magic.user.isLoggedIn()
}