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

function toObject<TIn, TOut, T extends PropertyTransformer<TIn, TOut>>(
  transformer: T,
  data: TIn,
): TransformOutput<T> {
  const out: Partial<TransformOutput<T>> = {};

  for (const [property, transform] of entries(transformer))
    out[property] = transform(data) as (typeof out)[typeof property];

  return out as TransformOutput<T>;
}

function toValues<TIn, TOut, T extends PropertyTransformer<TIn, TOut>>(
  transformer: T,
  data: TIn,
): TransformOutput<T>[keyof T][] {
  return Object.values(toObject(transformer, data));
}

const define: typeof Object.assign = (...args: unknown[]) => Object.assign({}, ...args);

export const xf = {
  define,
  toObject,
  toValues,
};
