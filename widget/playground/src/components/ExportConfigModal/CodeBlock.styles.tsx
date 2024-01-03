import { Button, styled } from '@yeager-dev/ui';

export const CopyCodeBlock = styled('div', {
  position: 'absolute',
  right: '$16',
  bottom: '$12',
});

export const CopyCodeBlockButton = styled(Button, {
  width: '$48',
  height: '$48',
  lineHeight: '$12 !important',
});

export const CodeBlockContainer = styled('div', {
  position: 'relative',
  borderRadius: '$sm',
  height: '507px',
});
