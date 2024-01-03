import { styled } from '@yeager-dev/ui';

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
  },
  '&:hover': {
    backgroundColor: '$neutral200',
  },
});

export const Indicator = styled('div', {
  width: '7px',
  height: '64px',
  borderRadius: '0 20px 20px 0',
  backgroundColor: '$secondary500',
  position: 'absolute',
  transition: 'transform 0.4s ease-in-out',
  left: 0,
  top: 20,
});

export const TabsContainer = styled(Flex, {
  flexDirection: 'column',
  position: 'relative',
  width: '100%',
});

export const StyledAnchor = styled('a', {
  textDecoration: 'none',
  padding: '$15 0',
  '&:hover': {
    backgroundColor: '$neutral200',
  },
});
