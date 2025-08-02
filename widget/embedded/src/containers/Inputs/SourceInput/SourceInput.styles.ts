import type { SwapInputPropTypes } from '@rango-dev/ui';

import { styled } from '@rango-dev/ui';

export const FromContainer = styled('div', {
  position: 'relative',
});

export const swapInputStyles: SwapInputPropTypes['style'] = {
  container: {
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
  },
};
