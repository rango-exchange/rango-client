import { styled } from '@rango-dev/ui';

export const List = styled('ul', {
  padding: 0,
  margin: 0,
  listStyle: 'none',
  height: 355,
  overflowY: 'auto',
  paddingRight: '$5',
  '.image-container': {
    borderRadius: '$xm',
    overflow: 'hidden',
  },
});

export const Content = styled('div', {
  minHeight: 325,
});
