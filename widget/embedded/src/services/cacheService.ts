import type { Token } from 'rango-sdk';

interface CacheServiceInterface<V> {
  get<K extends keyof V>(key: K): V[K] | undefined;
  set<K extends keyof V>(key: K, value: V[K]): void;
  remove<K extends keyof V>(key: K): void;
  clear(): void;
}

class CacheService<T> implements CacheServiceInterface<T> {
  #cache: Map<string, T[keyof T]> = new Map();

  get<K extends keyof T>(key: K): T[K] | undefined {
    return this.#cache.get(key as string) as T[K];
  }

  set<K extends keyof T>(key: K, value: T[K]): void {
    this.#cache.set(key as string, value);
  }

  remove<K extends keyof T>(key: K): void {
    this.#cache.delete(key as string);
  }

  clear(): void {
    this.#cache.clear();
  }
}

export type CachedEntries = {
  supportedSourceTokens: Token[];
  supportedDestinationTokens: Token[];
};

export const cacheService = new CacheService<CachedEntries>();
