import { Button, TextField, Typography } from '../../components';
import { css, darkTheme, styled } from '../../theme';

export const textStyles = css();

export const Container = styled('div', {
  $$color: '$colors$neutral100',
  [`.${darkTheme} &`]: {
    $$color: '$colors$neutral300',
  },
  backgroundColor: '$$color',
  borderRadius: '$xm',
  padding: '$15',
  variants: {
    sharpBottomStyle: {
      true: {
        borderBottomLeftRadius: '$0',
        borderBottomRightRadius: '$0',
      },
    },
  },
  [`& .${textStyles}`]: {
    $$color: '$colors$neutral600',
    [`.${darkTheme} &`]: {
      $$color: '$colors$neutral700',
    },
    color: '$$color',
  },
});

export const InputAmount = styled(TextField, {
  width: '100%',
  padding: '0',
  fontSize: '$18',
  lineHeight: '$26',
  fontWeight: '$medium',
  textAlign: 'right',
  '&:disabled': {
    cursor: 'unset',
  },
});
export const MaxButton = styled(Button, {
  $$color: '$colors$info300',
  [`.${darkTheme} &`]: {
    $$color: '$colors$secondary800',
  },
  backgroundColor: '$$color',
});

export const ValueTypography = styled('div', {
  display: 'flex',
  width: '100%',
  textAlign: 'right',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  variants: {
    hasWarning: {
      true: {
        '& ._typography': {
          color: '$warning500',
        },
      },
      false: {
        '& ._typography': {
          $$color: '$colors$neutral600',
          [`.${darkTheme} &`]: {
            $$color: '$colors$neutral700',
          },
          color: '$$color',
        },
      },
    },
  },
});

export const formStyles = css({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});

export const labelStyles = css({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});

export const balanceStyles = css({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

export const amountStyles = css({
  width: '45%',
  maxWidth: '170px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'end',
  flexGrow: 1,
});

export const labelContainerStyles = css({
  paddingBottom: '$5',
});

export const UsdPrice = styled(Typography, {
  width: '100%',
  textAlign: 'right',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});
