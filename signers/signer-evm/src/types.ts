import type { TypedDataDomain, TypedDataField } from 'ethers';

export type TypedData = {
  domain: TypedDataDomain;
  types: Record<string, Array<TypedDataField>>;
  value: Record<string, unknown>;
};
