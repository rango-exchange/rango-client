import React, { PropsWithChildren, ReactNode } from 'react';
import { css, styled } from '../../theme';
import Spinner from '../Spinner';

const icon = css({
  margin: '0 $3',
});

const ButtonContainer = styled('button', {
  borderRadius: '$s',
  fontSize: '$m',
  fontWeight: '$l',
  cursor: 'pointer',
  padding: '$3',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '&:disabled': {
    background: '$backgroundColorDisabled',
    color: '$neutral-400',
    border: 0,
  },
  '&:hover': {
    opacity: 0.75,
  },
  variants: {
    variant: {
      contained: {
        background: '$primary-500',
        color: '$text',
        border: 0,
      },
      outlined: {
        background: 'transparent',
        border: 1,
        borderStyle: 'solid',
        color: '$primary-500',
        borderColor: '$primary-500',
        '&:hover': {
          backgroundColor: '$hover',
          border: 0,
        },
      },
      text: {
        background: 'transparent',
        border: 0,
        color: '$primary-500',
      },
    },
    fullWidth: {
      true: {
        width: '100%',
      },
    },
  },
});

export interface PropTypes {
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  variant: 'contained' | 'outlined' | 'text';
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  endIcon?: ReactNode;
  startIcon?: ReactNode;
}

function Button({
  children,
  loading,
  disabled,
  startIcon,
  endIcon,
  ...props
}: PropsWithChildren<PropTypes>) {
  return (
    <ButtonContainer disabled={disabled || loading} {...props}>
      {startIcon && <div className={icon()}>{startIcon}</div>}
      {children}
      {loading && <Spinner />}
      {endIcon && <div className={icon()}>{endIcon}</div>}
    </ButtonContainer>
  );
}

export default Button;
