import type { QuoteError, QuoteWarning } from '../../types';

export interface PropTypes {
  loading: boolean;
  error: QuoteError | null;
  warning: QuoteWarning | null;
  showWarningModal: boolean;
  confirmationDisabled: boolean;
  refetchQuote: () => void;
  onOpenWarningModal: () => void;
  onCloseWarningModal: () => void;
  onConfirmWarningModal: () => void;
  onChangeSettings: () => void;
}

type ModalPropTypesKeys = keyof Omit<PropTypes, 'extraSpace' | 'loading'>;

export type ModalPropTypes = Pick<PropTypes, ModalPropTypesKeys> & {
  open: boolean;
};

export interface ModalContentData {
  title: string;
  value: string;
  valueColor?: string;
}
