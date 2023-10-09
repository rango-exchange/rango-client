export interface PropTypes {
  fetch: () => void;
  error: boolean;
  diagnosisMessage?: string;
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
