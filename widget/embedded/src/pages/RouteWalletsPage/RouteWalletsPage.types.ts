import type { PropTypes as WalletListPropTypes } from '../../components/ConfirmWalletsModal/WalletList.type';

export type SupportedWalletsPropTypes = {
  blockchain: string;
  onShowMore: () => void;
} & Pick<WalletListPropTypes, 'isSelected' | 'selectWallet'>;
