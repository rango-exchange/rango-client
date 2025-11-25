import type { ModalPropTypes } from '@rango-dev/ui';

import { darkColors, darkTheme, styled } from '@rango-dev/ui';

export const modalStyles: ModalPropTypes['styles'] = {
  footer: {
    paddingTop: '$10',
  },
};

export const WalletWarningItem = styled('div', {
  backgroundColor: '$neutral100',
  width: '100%',
  padding: '$16',
  borderRadius: '$xm',

  [`.${darkTheme} &`]: {
    backgroundColor: '$neutral300',
  },

  '& .wallet-info': {
    height: '$24',
    display: 'flex',
    alignItems: 'center',
    gap: '$8',
  },
});

export const Separator = styled('div', {
  width: '100%',
  borderBottom: `1px ${darkColors.neutral800} solid`,
  margin: '$16 0',
});
