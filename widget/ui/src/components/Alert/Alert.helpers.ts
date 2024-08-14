import type { AlertPropTypes, Type } from './Alert.types.js';

export const getColor = (type: Type, variant: AlertPropTypes['variant']) => {
  if (variant === 'regular') {
    return undefined;
  }

  switch (type) {
    case 'success':
    case 'warning':
    case 'error':
    case 'info':
      return `${type}500`;
    default:
      return undefined;
  }
};

export const mapVariantToSize = (variant: AlertPropTypes['variant']) => {
  switch (variant) {
    case 'alarm':
      return 'small';
    case 'regular':
      return 'xsmall';
    default:
      return 'xsmall';
  }
};
