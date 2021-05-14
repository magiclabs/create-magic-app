import { Magic } from 'magic-sdk'

// Create client-side Magic instance
const createMagic = (key) => {
  return typeof window != 'undefined' && new Magic(key)
}

export const magic = createMagic(process.env.NUXT_ENV_MAGIC_PUBLISHABLE_KEY)
