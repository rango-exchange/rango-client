import type { BestRouteResponse } from 'rango-sdk';

export interface PropTypes {
  data: BestRouteResponse | null;
  fetch: () => void;
  error: string;
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
