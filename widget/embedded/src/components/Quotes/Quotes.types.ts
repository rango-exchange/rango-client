import type { SelectedQuote } from '../../types';

export type PropTypes = {
  loading: boolean;
  onClickOnQuote: (quote: SelectedQuote) => void;
  fetch: (shouldChangeSelectedQuote?: boolean) => void;
  showModalFee?: boolean;
  hasSort?: boolean;
  fullExpandedMode?: boolean;
};
