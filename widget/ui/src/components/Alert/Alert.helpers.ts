import type { Type } from './Alert.types';

export const getColor = (type: Type, variant: 'alarm' | 'regular') => {
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

export const mapVariantToSize = (variant: 'alarm' | 'regular') => {
  switch (variant) {
    case 'alarm':
      return 'small';
    case 'regular':
      return 'xsmall';
  }
};
