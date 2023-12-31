import { darkTheme, styled } from '../../theme';

export const BaseListItem = styled('li', {
  width: '100%',
  overflow: 'hidden',
  borderRadius: '$xs',
  display: 'flex',
  alignItems: 'center',
  padding: '$10 $5',
  border: 0,
  backgroundColor: 'transparent',

  '.item-start-container': {
    paddingRight: '$10',
    flexShrink: 0,

    '& svg': {
      display: 'block',
    },
  },
  '.item-text-container': {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 'auto',
    textAlign: 'left',
    '._description': {
      $$color: '$colors$neutral600',
      [`.${darkTheme} &`]: {
        $$color: '$colors$neutral700',
      },
      color: '$$color',
    },

    '.item-text-title': {
      fontWeight: 'bold',
      display: 'flex',
      alignItems: 'center',
    },
  },
  '.item-end-container': {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: '$10',
    overflow: 'hidden',
  },
  variants: {
    hasDivider: {
      true: {
        borderBottom: '1px solid',
        $$color: '$colors$neutral300',
        [`.${darkTheme} &`]: {
          $$color: '$colors$neutral400',
        },
        borderColor: '$$color',
        borderBottomRightRadius: 0,
        borderBottomLeftRadius: 0,
      },
    },
  },
});
