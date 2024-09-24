type Simplify<T> = {
  [K in keyof T]: T[K];
};

export type PropertyTransformer<In = unknown, Out = unknown> = Record<
  string,
  <T extends In>(data: T) => Out
>;

type TransformOutput<T extends PropertyTransformer> = Simplify<{
  [K in keyof T]: ReturnType<T[K]>;
}>;

type Entry<T extends PropertyTransformer> = [keyof T, T[keyof T]];

const entries = Object.entries as <T extends PropertyTransformer>(obj: T) => Entry<T>[];

/**
 * Creates a new object containing all the transformed properties.
 *
 * @example
 * ```ts
 * import { type PropertyTransformer, xf } from '@driimus/xf';
 *
 * type User = {
 *   id: string;
 *   firstName: string;
 *   lastName: string;
 *   type?: 'admin' | 'user';
 * };
 * 
 * const data: User = { id: '1', firstName: 'Adam', lastName: 'Jones' };
 *
 * const out = xf.apply(
 *   {
 *     fullName(user) { return `${user.firstName} ${user.lastName}`; },
 *   },
 *   data
 * ); // { fullName: 'Adam Jones' }
 * ```
 */
export const apply = <TIn, TOut, T extends PropertyTransformer<TIn, TOut>>(
  transformer: T,
  data: TIn,
): TransformOutput<T> => {
  const out: Partial<TransformOutput<T>> = {};

  for (const [property, transform] of entries(transformer))
    out[property] = transform(data) as (typeof out)[typeof property];

  return out as TransformOutput<T>;
};

/**
 * Merges multiple property transformers into a new object.
 *
 * @remarks curried wrapper for {@link Object.assign}
 *
 * @example
 * ```ts
 * import { type PropertyTransformer, xf } from '@driimus/xf';
 *
 * type User = {
 *   id: string;
 *   firstName: string;
 *   lastName: string;
 *   type?: 'admin' | 'user';
 * };
 *
 * const transformer = xf.define(
 *   {
 *     fullName(user) { return `${user.firstName} ${user.lastName}`; },
 *   } satisfies PropertyTransformer<User>,
 *   {
 *     type(user) { return user.type ?? 'user' },
 *   } satisfies PropertyTransformer<User>,
 * );
 * ```
 */
export const define: typeof Object.assign = (...args: unknown[]) => Object.assign({}, ...args);

export const xf = {
  apply,
  define,
};
