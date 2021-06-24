import { Magic } from "magic-sdk"

let magic

if (typeof window !== `undefined`) {
  magic = new Magic(process.env.GATSBY_MAGIC_PUBLISHABLE_API_KEY)
}

export { magic }