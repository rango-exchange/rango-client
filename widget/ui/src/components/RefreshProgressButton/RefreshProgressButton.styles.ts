import { styled } from '../../theme';

export const StyledEllipse = styled('ellipse', {
  cx: '12.5px',
  cy: '12.5px',
  rx: '7.7px',
  ry: '7.7px',
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
