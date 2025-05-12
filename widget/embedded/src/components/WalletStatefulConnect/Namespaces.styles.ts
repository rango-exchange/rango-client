import { Button, darkTheme, Image, styled, Typography } from '@rango-dev/ui';

export const NamespaceList = styled('ul', {
  padding: 0,
  paddingTop: '$10',
  paddingBottom: '$20',
  margin: 0,
});

export const NamespaceItemContainer = styled('li', {
  backgroundColor: '$neutral200',
  padding: '$16',
  borderRadius: '$sm',
  variants: {
    clickable: {
      true: {
        cursor: 'pointer',
      },
    },
    hasError: {
      true: {
        background: '$error100 ',
        [`.${darkTheme} &`]: {
          backgroundColor: '$error700',
        },
      },
    },
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
  display: 'flex',
  gap: '$8',
  alignItems: 'center',
});

export const NamespaceItemInnerContent = styled('div', {
  flex: '1',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
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

export const UnsupportedNamespaceItemInnerContent = styled('div', {
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

export const NamespaceAccountAddress = styled(Typography, {
  maxWidth: '100px',
});

export const NamespaceItemError = styled('div', {
  paddingLeft: '48px',
});

export const NamespaceItemErrorDropdownToggle = styled('div', {
  display: 'flex',
  gap: '2px',
  cursor: 'pointer',
  alignItems: 'center',
  width: 'fit-content',
});

export const NamespaceDetachedItemInfo = styled('div', {
  display: 'flex',
  gap: '6px',
  alignItems: 'center',
});
