import type { Type } from './Alert.types';

export const getColor = (type: Type, variant: 'alarm' | 'regular') => {
  if (variant === 'regular') {
    return 'neutral900';
  }

  switch (type) {
    case 'success':
    case 'warning':
    case 'error':
    case 'info':
      return type;
    default:
      return 'neutral900';
  }
};
