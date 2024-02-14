import type { PropTypes, Type } from './Alert.types';

export const getColor = (type: Type, variant: PropTypes['variant']) => {
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

export const mapVariantToSize = (variant: PropTypes['variant']) => {
  switch (variant) {
    case 'alarm':
      return 'small';
    case 'regular':
      return 'xsmall';
    default:
      return 'xsmall';
  }
};
