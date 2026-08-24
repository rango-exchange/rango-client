import { WALLET_ID as BINANCE } from '@rango-dev/provider-binance';
import { WALLET_ID as BITGET } from '@rango-dev/provider-bitget';
import { WALLET_ID as BRAAVOS } from '@rango-dev/provider-braavos';
import { WALLET_ID as BRAVE } from '@rango-dev/provider-brave';
import { WALLET_ID as COIN98 } from '@rango-dev/provider-coin98';
import { WALLET_ID as COINBASE } from '@rango-dev/provider-coinbase';
import { WALLET_ID as DEFAULT } from '@rango-dev/provider-default';
import { WALLET_ID as ENKRYPT } from '@rango-dev/provider-enkrypt';
import { WALLET_ID as EXODUS } from '@rango-dev/provider-exodus';
import { WALLET_ID as FREIGHTER } from '@rango-dev/provider-freighter';
import { WALLET_ID as GEMWALLET } from '@rango-dev/provider-gemwallet';
import { WALLET_ID as LEDGER } from '@rango-dev/provider-ledger';
import { WALLET_ID as MATH } from '@rango-dev/provider-math-wallet';
import { WALLET_ID as META_MASK } from '@rango-dev/provider-metamask';
import { WALLET_ID as NOIR_WALLET } from '@rango-dev/provider-noir-wallet';
import { WALLET_ID as OKX } from '@rango-dev/provider-okx';
import { WALLET_ID as PHANTOM } from '@rango-dev/provider-phantom';
import { WALLET_ID as RABBY } from '@rango-dev/provider-rabby';
import { WALLET_ID as READY } from '@rango-dev/provider-ready';
import { WALLET_ID as SAFE } from '@rango-dev/provider-safe';
import { WALLET_ID as SAFEPAL } from '@rango-dev/provider-safepal';
import { WALLET_ID as SLUSH } from '@rango-dev/provider-slush';
import { WALLET_ID as SOLFLARE } from '@rango-dev/provider-solflare';
import { WALLET_ID as TAHO } from '@rango-dev/provider-taho';
import { WALLET_ID as TOKEN_POCKET } from '@rango-dev/provider-tokenpocket';
import { WALLET_ID as TOMO } from '@rango-dev/provider-tomo';
import { WALLET_ID as TON_CONNECT } from '@rango-dev/provider-tonconnect';
import { WALLET_ID as TREZOR } from '@rango-dev/provider-trezor';
import { WALLET_ID as TRON_LINK } from '@rango-dev/provider-tron-link';
import { WALLET_ID as TRUST_WALLET } from '@rango-dev/provider-trustwallet';
import { WALLET_ID as UNISAT } from '@rango-dev/provider-unisat';
import { WALLET_ID as VULTISIG } from '@rango-dev/provider-vultisig';
import { WALLET_ID as WALLET_CONNECT_2 } from '@rango-dev/provider-walletconnect-2';
import { WALLET_ID as XVERSE } from '@rango-dev/provider-xverse';

export const WalletTypes = {
  DEFAULT,
  META_MASK,
  WALLET_CONNECT_2,
  TRUST_WALLET,
  BINANCE,
  PHANTOM,
  BITGET,
  TRON_LINK,
  COINBASE,
  READY,
  COIN98,
  SAFEPAL,
  SAFE,
  TOKEN_POCKET,
  BRAVE,
  BRAAVOS,
  MATH,
  EXODUS,
  OKX,
  ENKRYPT,
  TAHO,
  LEDGER,
  RABBY,
  TOMO,
  TREZOR,
  SOLFLARE,
  SLUSH,
  TON_CONNECT,
  XVERSE,
  FREIGHTER,
  GEMWALLET,
  NOIR_WALLET,
  UNISAT,
  VULTISIG,
} as const;
