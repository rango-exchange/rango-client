import { CosmosTransaction } from '../../../api/models/TransactionModels';
import { WalletType } from '../../../utils/Constants';
import { WalletSigners } from '../core/types';
import { defaultSigners } from '../shared/signers';
import { JSONSerializable } from '@terra-money/terra.js/dist/util/json';
import { Coin, CreateTxOptions, Msg as TerraMsg } from '@terra-money/terra.js';
import { Fee } from '@terra-money/terra.js/dist/core';

export default function getSigners(provider: any): WalletSigners {
  return {
    ...defaultSigners({
      provider,
      walletType: WalletType.TERRA_STATION,
      supportEvm: false,
    }),
    executeCosmosMessage: async (cosmos: CosmosTransaction): Promise<string> => {
      return new Promise<string>((resolve, reject) => {
        provider
          .post(cosmosTxToTerraTx(cosmos))
          .then((result: { result: { txhash: string | PromiseLike<string> } }) =>
            resolve(result?.result?.txhash),
          )
          .catch((error: any) => {
            console.log({ error });
            reject(error);
          });
      });
    },
  };
}

function cosmosTxToTerraTx(tx: CosmosTransaction): CreateTxOptions {
  let tmpStdFee: Fee | undefined = undefined;
  if (tx.data.fee) {
    const tmpCoinsFee = tx.data.fee.amount.map((item) => new Coin(item.denom, item.amount));
    // let coins = Coins()
    tmpStdFee = new Fee(parseInt(tx.data.fee.gas), tmpCoinsFee);
  }

  const msgs = tx.data.msgs.map(
    (m) => new TerraMessageGeneralJsonSerializable(m) as unknown as TerraMsg,
  );

  return {
    msgs,
    fee: tmpStdFee,
    memo: tx.data.memo || '',
    gas: tx.data.fee?.gas,
  };
}

export class TerraMessageGeneralJsonSerializable extends JSONSerializable<any, any, any> {
  constructor(public raw: any) {
    super();
  }

  public static fromData(data: any): TerraMessageGeneralJsonSerializable {
    return new TerraMessageGeneralJsonSerializable(data);
  }

  toData(): any {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { __type, value, ...rest } = this.raw;
    return JSON.parse(JSON.stringify({ ...rest, ...value }));
  }

  toAmino(): any {
    return this.toData();
  }

  toProto(): any {
    return this.toData();
  }
}
