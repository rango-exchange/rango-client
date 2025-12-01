import type { PropTypes as WalletListPropTypes } from '../ConfirmWalletsModal/WalletList.type';

export type PropTypes = {
  blockchain: string;
  onClickBack?: () => void;
} & Pick<WalletListPropTypes, 'isSelected' | 'selectWallet'>;
