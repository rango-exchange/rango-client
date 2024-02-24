import type { SelectedQuote } from '../../types';

export type PropTypes = {
  loading: boolean;
  onClickOnQuote: (quote: SelectedQuote) => void;
  fetch: (shouldChangeSelectedQuote?: boolean) => void;
  onClickRefresh?: () => void;
  isVisible: boolean;
};
