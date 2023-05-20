declare module 'subtract-object' {
  export default function subtractObject<T extends object, U extends object>(
    objectA: T,
    objectB: U,
  ): Partial<U>;
}
