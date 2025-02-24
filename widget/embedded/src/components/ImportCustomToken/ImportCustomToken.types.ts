import type {
  CustomTokenError,
  UseFetchCustomToken,
} from '../../hooks/useFetchCustomToken';
import type { TokenData } from '../TokenList/TokenList.types';
import type { BlockchainMeta } from 'rango-sdk';

export type PropTypes = {
  token: TokenData | null;
  error?: CustomTokenError;
  blockchain?: BlockchainMeta;
  address: string;
  fetchCustomToken?: UseFetchCustomToken['fetchCustomToken'];
  onCloseErrorModal?: () => void;
  onImport: () => void;
  onExitErrorModal: () => void;
  onExitImportModal: () => void;
};
