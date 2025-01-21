type SolanaSignerConfig = {
  customRPC?: string | string[];
};

const solanaSignerConfig: SolanaSignerConfig = {};

export function setSolanaSignerConfig<Key extends keyof SolanaSignerConfig>(
  key: Key,
  value: SolanaSignerConfig[Key]
) {
  solanaSignerConfig[key] = value;

  return value;
}

export function getSolanaSignerConfig<Key extends keyof SolanaSignerConfig>(
  key: Key
): SolanaSignerConfig[Key] {
  return solanaSignerConfig[key];
}
