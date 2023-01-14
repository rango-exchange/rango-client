import { css } from '@stitches/react';
import React, { PropsWithChildren, ReactNode } from 'react';
import { styled } from '../../theme';
import Spinner from '../Spinner';

const icon = css({
  margin: '0 $l',
});

const ButtonContainer = styled('button', {
  borderRadius: '5px',
  fontSize: '$m',
  fontWeight: '$l',
  cursor: 'pointer',
  height:'52px',
  padding: '$l',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '&:disabled': {
    background: '$neutral01',
    color: '$neutral02',
    border: 0,
  },
  variants: {
    variant: {
      contained: {
        background: '$primary',
        color: '$text01',
        border: 0,
      },
      outlined: {
        background: 'transparent',
        border: 1,
        borderStyle: 'solid',
        color: '$primary',
        borderColor: '$primary',
      },
      text: {
        background: 'transparent',
        border: 0,
        color: '$primary',
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
      {startIcon}
      {children && <div className={icon()}>{children} </div>}
      {loading && <Spinner />}
      {endIcon}
    </ButtonContainer>
  );
}

export default Button;
