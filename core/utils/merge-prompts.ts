import { Questions } from 'compiled/zombi';

/**
 * Merge multiple `Zombi` prompt sources into one array.
 */

/* eslint-disable prettier/prettier */
export function mergePrompts<A>(...questions: [Questions<A>]): Questions<A>;
export function mergePrompts<A, B>(...questions: [Questions<A>, Questions<B>]): Questions<A & B>;
export function mergePrompts<A, B, C>(...questions: [Questions<A>, Questions<B>, Questions<C>]): Questions<A & B & C>;
export function mergePrompts<A, B, C, D>(...questions: [Questions<A>, Questions<B>, Questions<C>, Questions<D>]): Questions<A & B & C & D>;
export function mergePrompts<A, B, C, D, E>(...questions: [Questions<A>, Questions<B>, Questions<C>, Questions<D>, Questions<E>]): Questions<A & B & C & D & E>;
export function mergePrompts<A, B, C, D, E, F>(...questions: [Questions<A>, Questions<B>, Questions<C>, Questions<D>, Questions<E>, Questions<F>]): Questions<A & B & C & D & E & F>;
export function mergePrompts<A, B, C, D, E, F, G>(...questions: [Questions<A>, Questions<B>, Questions<C>, Questions<D>, Questions<E>, Questions<F>, Questions<G>]): Questions<A & B & C & D & E & F & G>;
export function mergePrompts<A, B, C, D, E, F, G, H>(...questions: [Questions<A>, Questions<B>, Questions<C>, Questions<D>, Questions<E>, Questions<F>, Questions<G>, Questions<H>]): Questions<A & B & C & D & E & F & G & H>;
export function mergePrompts<A, B, C, D, E, F, G, H, I>(...questions: [Questions<A>, Questions<B>, Questions<C>, Questions<D>, Questions<E>, Questions<F>, Questions<G>, Questions<H>, Questions<I>]): Questions<A & B & C & D & E & F & G & H & I>;
export function mergePrompts<A, B, C, D, E, F, G, H, I, J>(...questions: [Questions<A>, Questions<B>, Questions<C>, Questions<D>, Questions<E>, Questions<F>, Questions<G>, Questions<H>, Questions<I>, Questions<J>]): Questions<A & B & C & D & E & F & G & H & I & J>;
/* eslint-enable prettier/prettier */

export function mergePrompts(...questions: Questions<any>[]): Questions<any> {
  const result: Questions<any> = [];

  questions.forEach((q) => {
    if (Array.isArray(q)) {
      result.push(...q);
    } else {
      result.push(q);
    }
  });

  return result;
}
