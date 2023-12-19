import { css, styled } from '../../theme';

export const Container = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  variants: {
    direction: {
      vertical: {
        flexDirection: 'column',
        alignItems: 'start',
      },
      horizontal: { flexDirection: 'row', width: '100%', alignItems: 'end' },
    },
    centerAlign: {
      true: { alignItems: 'center', justifyContent: 'center' },
    },
  },
});

export const tokenAmountStyles = css({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

export const usdValueStyles = css({
  display: 'flex',
  paddingTop: '$5',
});
