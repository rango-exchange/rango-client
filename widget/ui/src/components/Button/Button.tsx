import React, { PropsWithChildren } from 'react';
import { styled } from '../../theme';

const ButtonContainer = styled('button', {
  borderRadius: '$5',
  fontSize: '$12',
  padding: '$8 $12',
  border: 0,
  variants: {
    type: {
      transparent: {
        color: 'black',
        '&:hover': {
          backgroundColor: '$black',
          color: '$white',
        },
      },
      primary: {
        backgroundColor: '$primary',
        color: '$white',
        '&:hover': {
          backgroundColor: 'lightgray',
        },
      },
    },
  },
});

export interface PropTypes {
  type: 'primary' | 'transparent';
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

function Button(props: PropsWithChildren<PropTypes>) {
  let { children, type, onClick } = props;

  return (
    <ButtonContainer type={type} onClick={onClick}>
      {children}
    </ButtonContainer>
  );
}

export default Button;
