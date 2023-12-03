import { styled } from '@rango-dev/ui';

const Flex = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

export const Container = styled('div', {
  borderRadius: '20px',
  display: 'flex',
  justifyContent: 'space-between',
  padding: '$46 0 $30',
  backgroundColor: '$background',
  width: '96px',
  height: '100%',
  flexDirection: 'column',
});

export const IconLabelContaienr = styled(Flex, {
  flexDirection: 'column',
});

export const IconWrapper = styled(Flex, {
  width: '$32',
  height: '$32',
});

export const Tab = styled(Flex, {
  flexDirection: 'column',
  padding: '$15 0',
  cursor: 'pointer',
  width: '100%',
  variants: {
    disabled: {
      true: {
        cursor: 'not-allowed',
        '&:hover': {
          backgroundColor: 'unset',
        },
      },
    },
    active: {
      true: {
        position: 'relative',
      },
    },
  },
  '&:hover': {
    backgroundColor: '$neutral200',
  },
});

export const Indicator = styled('div', {
  width: '7px',
  height: '64px',
  borderRadius: '20px 0 0 20px',
  backgroundColor: '$secondary500',
  position: 'absolute',
  transform: 'rotate(180deg)',
  left: 0,
});

export const TabsContainer = styled(Flex, {
  flexDirection: 'column',
  width: '100%',
});

export const StyledAnchor = styled('a', {
  textDecoration: 'none',
  padding: '$15 0',
  '&:hover': {
    backgroundColor: '$neutral200',
  },
});
