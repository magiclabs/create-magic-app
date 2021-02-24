import { Magic } from 'magic-sdk';

const createMagic = (key) => typeof window != 'undefined' && new Magic(key);

export const magic = createMagic(process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY);
