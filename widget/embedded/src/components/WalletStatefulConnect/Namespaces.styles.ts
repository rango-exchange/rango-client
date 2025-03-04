import { Image, styled, Typography } from '@rango-dev/ui';

export const NamespaceList = styled('ul', {
  padding: 0,
});

export const NamespaceItemContainer = styled('li', {
  backgroundColor: '$neutral200',
  padding: '$16',
  display: 'flex',
  gap: '$8',
  cursor: 'pointer',
  borderRadius: '$sm',
  alignItems: 'center',
  height: '72px',
  variants: {
    clickable: {
      true: {
        cursor: 'pointer',
      },
    },
  },
});

export const NamespaceItemContent = styled('div', {
  flex: '1',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
});

export const NotSupportedNamespaceItemContent = styled('div', {
  flex: '1',
  display: 'flex',
  alignItems: 'center',
  gap: '$4',
  opacity: '0.5',
});

export const NamespaceLogo = styled(Image, {
  variants: {
    disabled: {
      true: {
        opacity: '0.5',
      },
    },
  },
});

export const NamespaceAccountAddress = styled(Typography, {
  maxWidth: '100px',
});
