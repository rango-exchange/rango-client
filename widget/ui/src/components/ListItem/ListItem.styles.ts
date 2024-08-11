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
      color: '$foreground',
    },
  },
  '.item-end-container': {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: '$10',
    overflow: 'hidden',
    flexShrink: 0,
  },
  variants: {
    hasDivider: {
      true: {
        borderBottom: '1px solid',
        borderColor: '$neutral300',
        [`.${darkTheme} &`]: {
          borderColor: '$neutral400',
        },
        borderBottomRightRadius: 0,
        borderBottomLeftRadius: 0,
      },
    },
  },
});
