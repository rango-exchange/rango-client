import type { QuoteProps } from '../../components/Quote/Quote.types';
import type { QuoteError, QuoteWarning, SelectedQuote } from '../../types';

export type PropTypes = {
  quote: SelectedQuote | null;
  type: QuoteProps['type'];
  onClick?: (quote: SelectedQuote) => void;
  loading: boolean;
  tagHidden?: boolean;
  error: QuoteError | null;
  warning: QuoteWarning | null;
  id: string;
  autoScrollOnExpanding?: boolean;
  expanded?: boolean;
  onClickAllRoutes?: () => void;
  selected?: boolean;
  showModalFee?: boolean;
  fullExpandedMode?: boolean;
  container?: HTMLElement;
};
