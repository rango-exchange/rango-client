import type { NoResultError, QuoteRequestFailed } from '../../types';

export interface PropTypes {
  fetch: () => void;
  error: NoResultError | QuoteRequestFailed | null;
}

type AlertAction = {
  title: string;
  onClick: () => void;
};

type NotFoundAlert = {
  type: 'error' | 'warning';
  text: string;
  action: AlertAction | null;
};

export interface Info {
  alert: NotFoundAlert | null;
  description: string;
}
