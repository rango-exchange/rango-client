import type { SignerFactory } from 'rango-types';

import { DefaultSignerFactory } from 'rango-types';

export default function getSigners(): SignerFactory {
  const signers = new DefaultSignerFactory();
  return signers;
}
