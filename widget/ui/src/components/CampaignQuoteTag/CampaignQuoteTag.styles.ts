import { css, darkTheme, styled } from '../../theme.js';

export const getLabelStyles = css({});

export const TagContainer = styled('a', {
  backgroundColor: '$neutral400',
  borderRadius: '$xs',
  padding: '$2 $5',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'row',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  gap: '$2',
  '& img': {
    borderRadius: '50%',
    width: '$16',
    height: '$16',
  },
  [`& .${getLabelStyles}`]: {
    color: '$background',
    [`.${darkTheme} &`]: {
      color: '$foreground',
    },
  },
});
