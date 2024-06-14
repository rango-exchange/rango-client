import type { Provider } from '../hub/mod.js';
import type { LegacyProviderInterface } from '../legacy/mod.js';

type VersionedVLegacy = ['0.0.0', LegacyProviderInterface];
type VersionedV1 = ['1.0.0', Provider];
type AvailableVersions = VersionedVLegacy | VersionedV1;
export type Versions = AvailableVersions[];
// eslint-disable-next-line @typescript-eslint/no-magic-numbers
export type VersionInterface<T extends AvailableVersions[]> = T[1];

type SemVer<T extends [string, any]> = T extends [infer U, any] ? U : never;
type MatchVersion<T extends Versions, Version> = Extract<
  T[number],
  [Version, any]
>;

export function pickVersion<
  L extends Versions,
  V extends SemVer<Versions[number]>
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
  version: <T extends SemVer<Versions[number]>>(
    semver: T,
    value: VersionInterface<MatchVersion<Versions, T>>
  ) => DefineVersionsApi;
  build: () => Versions;
}

export function defineVersions(): DefineVersionsApi {
  const versions: Versions = [];
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
): Versions {
  return defineVersions().version('0.0.0', provider).build();
}
