import { css, darkTheme, IconButton, styled } from '@arlert-dev/ui';

export const IconContainer = styled('div', {
  position: 'relative',
  '&::before': {
    position: 'absolute',
    right: '1px',
    top: '-1px',
    width: '$8',
    height: '$8',
    borderRadius: '100%',
    backgroundColor: '$neutral300',
    [`.${darkTheme} &`]: {
      backgroundColor: '$neutral400',
    },
    padding: '$2',
  },
  variants: {
    isSelect: {
      true: {
        '&::before': {
          content: '',
        },
      },
    },
  },
});

export const FilterButton = styled(IconButton, {
  width: '$36',
  height: '$36',
  position: 'relative',
  padding: '0',
  overflow: 'unset',
  backgroundColor: '$neutral300',
  [`.${darkTheme} &`]: {
    backgroundColor: '$neutral400',
  },
  '&:hover': {
    backgroundColor: '$secondary100',
    [`.${darkTheme} &`]: {
      backgroundColor: '$neutral',
    },
    [`& ${IconContainer}::before`]: {
      backgroundColor: '$secondary100',
      [`.${darkTheme} &`]: {
        backgroundColor: '$neutral',
      },
    },
  },
  variants: {
    isSelect: {
      true: {
        border: '1px solid $secondary',
      },
    },
  },
});

export const Badge = styled('div', {
  position: 'absolute',
  width: '$6',
  height: '$6',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '3px',
  top: '$0',
  right: '1px',
  backgroundColor: '$secondary500',
});

export const FilterContainer = styled('div', {
  padding: '$15',
  borderRadius: '$sm',
  width: '248px',
  backgroundColor: '$background',
  zIndex: 10,
});

export const centeredFlexContainer = css({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});

export const FilterList = styled('ul', {
  margin: 0,
  listStyle: 'none',
  height: '100%',
  padding: 0,
  '.item-start-container': {
    paddingRight: '0 !important',
  },
});
