import { TypedFlags } from 'core/flags';
import { globalOptions } from 'core/global-options';

export type MakeMagicOptions = Omit<Partial<TypedFlags<typeof globalOptions>>, 'version' | 'help'> & { data?: {} };

export default function makeMagic(options?: MakeMagicOptions) {}

makeMagic({ template: '', data: { hello: 'world' } });
