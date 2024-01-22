import { styled } from '@rango-dev/ui';

const CONTENT_PADDING = '$20 $20 $10 $20';

const ScrollableArea = styled('div', {
  padding: CONTENT_PADDING,
  overflowY: 'auto',
  flexGrow: 1,
});

export { ScrollableArea, CONTENT_PADDING };
