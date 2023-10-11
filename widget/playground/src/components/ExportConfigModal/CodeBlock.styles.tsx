import { Button, styled } from '@rango-dev/ui';

export const CopyCodeBlockButton = styled(Button, {
  position: 'absolute',
  cursor: 'pointer',
  right: '$16',
  bottom: '$12',
  width: '$48',
  height: '$48',
  lineHeight: '$16 !important',
});

export const CodeBlockContainer = styled('div', {
  position: 'relative',
  borderRadius: '$sm',
  height: '507px',
});
