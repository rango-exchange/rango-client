import type { Provider } from '../hub/mod.js';
import type { LegacyProviderInterface } from '../legacy/mod.js';

type LegacyVersioned = ['0.0.0', LegacyProviderInterface];
type HubVersioned = ['1.0.0', Provider];
type AvailableVersionedProviders = LegacyVersioned | HubVersioned;
export type VersionedProviders = AvailableVersionedProviders[];
export type VersionInterface<T extends AvailableVersionedProviders[]> = T[1];

type SemVer<T extends [string, any]> = T extends [infer U, any] ? U : never;
type MatchVersion<T extends VersionedProviders, Version> = Extract<
  T[number],
  [Version, any]
>;

export function pickVersion<
  L extends VersionedProviders,
  V extends SemVer<VersionedProviders[number]>
>(list: L, targetVersion: V): MatchVersion<L, V> {
  if (!targetVersion) {
    throw new Error(`You should provide a valid semver, e.g 1.0.0.`);
  }

  const target = list.find(([version]) => version === targetVersion);

  if (!target) {
    throw new Error(
      `You target version hasn't been found. Available versions: ${Object.keys(
        list
      ).join(', ')}`
    );
  }
  return target as MatchVersion<L, V>;
}

interface DefineVersionsApi {
  version: <T extends SemVer<VersionedProviders[number]>>(
    semver: T,
    value: VersionInterface<MatchVersion<VersionedProviders, T>>
  ) => DefineVersionsApi;
  build: () => VersionedProviders;
}

export function defineVersions(): DefineVersionsApi {
  const versions: VersionedProviders = [];
  const api: DefineVersionsApi = {
    version: (semver, value) => {
      versions.push([semver, value]);
      return api;
    },
    build: () => {
      return versions;
    },
  };
  return api;
}

export function legacyProviderImportsToVersionsInterface(
  provider: LegacyProviderInterface
): VersionedProviders {
  return defineVersions().version('0.0.0', provider).build();
}
