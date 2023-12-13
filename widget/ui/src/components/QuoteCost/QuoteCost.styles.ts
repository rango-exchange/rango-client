import { css, styled } from '../../theme';

export const Container = styled('div', {
  borderRadius: '$xs',
  display: 'flex',
  justifyContent: 'start',
  alignItems: 'center',
  paddingBottom: '$10',
});

export const Separator = styled('div', {
  height: '$12',
  marginLeft: '$10',
  marginRight: '$10',
  borderLeft: '1px solid $foreground',
});

export const iconStyles = css({
  width: '$16',
  height: '$16',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

export const itemStyles = css({
  display: 'flex',
  alignItems: 'center',
});
