import { styled } from '../../theme';

export const StyledEllipse = styled('ellipse', {
  cx: 12.5,
  cy: 12.5,
  rx: 7.7,
  ry: 7.7,
  strokeLinecap: 'round',
  fill: 'none',
  strokeDasharray: 100,
  transform: `rotate(20deg)`,
  transformOrigin: 'center',
  variants: {
    type: {
      'in-progress': {
        stroke: '$info500',
        strokeWidth: 2,
      },
      basic: {
        strokeWidth: 1.8,
      },
    },
  },
});

export const StyledPath = styled('path', {
  fill: '$info500',
});
