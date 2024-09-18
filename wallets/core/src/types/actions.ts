export type AnyFunction = (...args: any[]) => any;
export type AnyPromiseFunction = (...args: any[]) => Promise<any>;

export type AndFunction<
  T extends Record<string, AnyPromiseFunction>,
  K extends keyof T
> = (result: Awaited<ReturnType<T[K]>>) => Awaited<ReturnType<T[K]>>;

export type FunctionWithContext<T, C> = T extends (...args: infer P) => infer R
  ? (context: C, ...args: P) => R
  : never;
