import { Button, Image, styled } from '@rango-dev/ui';

export const NamespaceList = styled('ul', {
  padding: 0,
  paddingTop: '$10',
  paddingBottom: '$20',
  margin: 0,
});

export const NamespaceItemContainer = styled('li', {
  backgroundColor: '$neutral200',
  padding: '$16',
  display: 'flex',
  gap: '$8',
  cursor: 'pointer',
  borderRadius: '$sm',
  alignItems: 'center',
  variants: {
    unsupported: {
      true: {
        cursor: 'not-allowed',
        paddingTop: '$8',
        paddingBottom: '$8',
      },
    },
  },
});

export const NamespaceItemContent = styled('div', {
  flex: '1',
  display: 'flex',
  flexDirection: 'column',
  height: '$40',
  variants: {
    showSupportedChains: {
      true: {
        justifyContent: 'space-between',
      },
      false: {
        justifyContent: 'center',
      },
    },
  },
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

export const StyledButton = styled(Button, {
  minHeight: '$40',
});
