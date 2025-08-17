import { styled } from '@rango-dev/ui';

export const IconWrapper = styled('div', {
  width: '$24',
  height: '$24',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

export const SearchInputContainer = styled('div', {
  width: '100%',
  '& ._text-field': {
    paddingLeft: '$10',
    '& input': {
      paddingLeft: '$2',
      paddingTop: '$12',
      paddingBottom: '$12',
    },
  },
});
