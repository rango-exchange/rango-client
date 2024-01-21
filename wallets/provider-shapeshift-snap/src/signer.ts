import type { SignerFactory } from 'rango-types';

import { DefaultSignerFactory, TransactionType as TxType } from 'rango-types';

import ShapeShiftSnapBaseSigner from './signer/shapeShiftSnapBaseSigner';
import ShapeShiftSnapCosmosSigner from './signer/shapeShiftSnapCosmosSigner';

export default function getSigners(provider: any): SignerFactory {
  const signers = new DefaultSignerFactory();
  signers.registerSigner(
    TxType.TRANSFER,
    new ShapeShiftSnapBaseSigner(provider)
  );
  signers.registerSigner(
    TxType.COSMOS,
    new ShapeShiftSnapCosmosSigner(provider)
  );
  return signers;
}
