import { styled } from '../../theme';

export const DividerContainer = styled('div', {
  flexShrink: 0,
  variants: {
    size: {
      2: {},
      4: {},
      8: {},
      10: {},
      12: {},
      16: {},
      18: {},
      20: {},
      24: {},
      30: {},
      32: {},
    },
    direction: {
      vertical: {},
      horizontal: {},
    },
  },
  compoundVariants: [
    {
      size: 2,
      direction: 'horizontal',
      css: {
        width: 2,
      },
    },
    {
      size: 2,
      direction: 'vertical',
      css: {
        height: 2,
      },
    },
    {
      size: 4,
      direction: 'horizontal',
      css: {
        width: '$4',
      },
    },
    {
      size: 4,
      direction: 'vertical',
      css: {
        height: '$4',
      },
    },
    {
      size: 8,
      direction: 'horizontal',
      css: {
        width: '$8',
      },
    },
    {
      size: 8,
      direction: 'vertical',
      css: {
        height: '$8',
      },
    },
    {
      size: 10,
      direction: 'horizontal',
      css: {
        width: '$10',
      },
    },
    {
      size: 10,
      direction: 'vertical',
      css: {
        height: '$10',
      },
    },
    {
      size: 12,
      direction: 'horizontal',
      css: {
        width: '$12',
      },
    },
    {
      size: 12,
      direction: 'vertical',
      css: {
        height: '$12',
      },
    },
    {
      size: 16,
      direction: 'horizontal',
      css: {
        width: '$16',
      },
    },
    {
      size: 16,
      direction: 'vertical',
      css: {
        height: '$16',
      },
    },
    {
      size: 18,
      direction: 'horizontal',
      css: {
        width: '$18',
      },
    },
    {
      size: 18,
      direction: 'vertical',
      css: {
        height: '$18',
      },
    },
    {
      size: 20,
      direction: 'horizontal',
      css: {
        width: '$20',
      },
    },
    {
      size: 20,
      direction: 'vertical',
      css: {
        height: '$20',
      },
    },
    {
      size: 24,
      direction: 'horizontal',
      css: {
        width: '$24',
      },
    },
    {
      size: 24,
      direction: 'vertical',
      css: {
        height: '$24',
      },
    },
    {
      size: 30,
      direction: 'horizontal',
      css: {
        width: '$30',
      },
    },
    {
      size: 30,
      direction: 'vertical',
      css: {
        height: '$30',
      },
    },
    {
      size: 32,
      direction: 'horizontal',
      css: {
        width: '$32',
      },
    },
    {
      size: 32,
      direction: 'vertical',
      css: {
        height: '$32',
      },
    },
  ],
});
