import { styled } from '@arlert-dev/ui';

import {
  WIDGET_MAX_HEIGHT,
  WIDGET_VARIANT_MAX_WIDTH,
} from '../../constants/styles';

const BOUNDARY_GUIDE_OUTLINE_WIDTH = 2;
const BOUNDARY_SIZE_HEIGHT = 26;

export const Container = styled('div', {
  position: 'relative',
  display: 'flex',
  justifyContent: 'center',
  paddingTop: '40px',
  transition: 'width .5s ease-in-out',
  margin: 'auto',
  height: '100%',
  variants: {
    variant: {
      default: { width: WIDGET_VARIANT_MAX_WIDTH.default },
      expanded: {
        width: WIDGET_VARIANT_MAX_WIDTH.expanded,
      },
      'full-expanded': {
        width: WIDGET_VARIANT_MAX_WIDTH['full-expanded'],
      },
    },
    boundaryVisible: {
      true: {
        minHeight:
          WIDGET_MAX_HEIGHT +
          2 * (BOUNDARY_GUIDE_OUTLINE_WIDTH + BOUNDARY_SIZE_HEIGHT),
      },
      false: {
        minHeight: WIDGET_MAX_HEIGHT,
      },
    },
  },
});

export const BoundaryGuide = styled('div', {
  position: 'absolute',
  top: '40px',
  left: 0,
  width: '100%',
  outlineStyle: 'dashed',
  outlineColor: '$neutral600',
  borderRadius: '20px',
  display: 'flex',
  justifyContent: 'center',
  transition: 'height .5s ease-in-out, outline-width .5s ease-in-out',
  variants: {
    visible: {
      true: {
        height: WIDGET_MAX_HEIGHT,
        outlineWidth: BOUNDARY_GUIDE_OUTLINE_WIDTH,
      },
      false: {
        height: 0,
        outlineWidth: 0,
      },
    },
  },
});

export const BoundarySize = styled('div', {
  position: 'absolute',
  height: BOUNDARY_SIZE_HEIGHT,
  display: 'flex',
  padding: '$6 0',
  variants: {
    side: {
      bottomLeft: {
        left: 0,
        bottom: -1 * (BOUNDARY_GUIDE_OUTLINE_WIDTH + BOUNDARY_SIZE_HEIGHT),
      },
      topRight: {
        top: -1 * (BOUNDARY_GUIDE_OUTLINE_WIDTH + BOUNDARY_SIZE_HEIGHT),
        right: 0,
      },
    },
  },
});
