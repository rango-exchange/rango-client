import { css, darkTheme, styled } from '../../theme';

export const getLabelStyles = css({});

export const TagContainer = styled('div', {
  backgroundColor: '$neutral400',
  borderRadius: '$xs',
  padding: '$2 $5',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  variants: {
    type: {
      RECOMMENDED: {
        [`& .${getLabelStyles}`]: {
          color: '$secondary500',
          [`.${darkTheme} &`]: {
            color: '$secondary400',
          },
        },
      },
      FASTEST: {
        [`& .${getLabelStyles}`]: {
          color: '$success500',
        },
      },
      HIGH_IMPACT: {
        [`& .${getLabelStyles}`]: {
          color: '$error500',
        },
      },
      LOWEST_FEE: {
        [`& .${getLabelStyles}`]: {
          color: '#FF4DAD',
        },
      },
      CENTRALIZED: {
        [`& .${getLabelStyles}`]: {
          color: '$warning500',
        },
      },
    },
  },
});
