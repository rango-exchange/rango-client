import { styled } from '@rango-dev/ui';

export const List = styled('ul', {
  height: 355,
  overflowY: 'auto',
  padding: 0,
  margin: 0,
  listStyle: 'none',
});

export const Content = styled('div', {
  height: 355,
  overflowY: 'auto',
  paddingRight: '$5',
  '.image-container': {
    borderRadius: '$xm',
    overflow: 'hidden',
  },
});
