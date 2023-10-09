import type { Step } from '../BestRoute/BestRoute.types';

export type StepDetailsProps = {
  step: Step;
  hasSeparator: boolean;
  type: 'route-details' | 'route-progress';
  state?: 'default' | 'in-progress' | 'completed' | 'warning' | 'error';
  isFocused?: boolean;
  tabIndex?: number;
};
