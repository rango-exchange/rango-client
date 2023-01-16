import React, { PropsWithChildren } from 'react';
import { styled } from '../../theme';
import Spinner from '../Spinner';

const ButtonContainer = styled('button', {
  borderRadius: '$5',
  fontSize: '$16',
  fontWeight: '$400',
  cursor: 'pointer',
  padding: '0 $12',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '&:disabled': {
    background: '$neutrals400 !important',
    border: 0,
  },
  variants: {
    fullWidth: {
      true: {
        width: '100%',
      },
    },
    size: {
      small: {
        height: '$32',
      },
      medium: {
        height: '$40',
      },
      large: {
        height: '$48',
      },
    },
    variant: {
      contained: {
        color: '$white',
        border: 0,
      },
      outlined: {
        background: 'transparent',
        border: 1,
        borderStyle: 'solid',
      },
      ghost: {
        background: 'transparent',
        border: 0,
      },
    },

    type: {
      primary: {},
      error: {},
      warning: {},
      success: {},
    },
  },

  compoundVariants: [
    {
      type: 'primary',
      variant: 'contained',
      css: {
        background: '$primary',
        '&:hover': {
          background: '$primary700',
        },
     '&:visited': {
          background: '$primary900',
        },  
        '&:focus': {
          background: '$primary600',
        }, 
        
      },
    },
    {
      type: 'primary',
      variant: 'outlined',
      css: {
        color: '$primary',
        borderColor: '$primary',
        '&:hover': {
          background: '$primary700',
        },
     '&:visited': {
          background: '$primary900',
        },  
        '&:focus': {
          background: '$primary600',
        }, 
      },
    },
    {
      type: 'primary',
      variant: 'ghost',
      css: {
        color: '$primary',
      },
    },
    {
      type: 'error',
      variant: 'contained',
      css: {
        background: '$error',
        '&:hover': {
          background: '$error700',
        },
     '&:visited': {
          background: '$error900',
        },  
        '&:focus': {
          background: '$error600',
        }, 
      },
    },
    {
      type: 'error',
      variant: 'outlined',
      css: {
        color: '$error',
        borderColor: '$error',
        '&:hover': {
          background: '$error700',
        },
     '&:visited': {
          background: '$error900',
        },  
        '&:focus': {
          background: '$error600',
        }, 
      },
    },
    {
      type: 'error',
      variant: 'ghost',
      css: {
        color: '$error',
      },
    },
    {
      type: 'warning',
      variant: 'contained',
      css: {
        background: '$warning',
        '&:hover': {
          background: '$warning700',
        },
     '&:visited': {
          background: '$warning900',
        },  
        '&:focus': {
          background: '$warning600',
        }, 
      },
    },
    {
      type: 'warning',
      variant: 'outlined',
      css: {
        color: '$warning',
        borderColor: '$warning',
        '&:hover': {
          background: '$warning700',
        },
     '&:visited': {
          background: '$warning900',
        },  
        '&:focus': {
          background: '$warning600',
        }, 
      },
    },
    {
      type: 'warning',
      variant: 'ghost',
      css: {
        color: '$warning',
      },
    },
    {
      type: 'success',
      variant: 'contained',
      css: {
        background: '$success',
        '&:hover': {
          background: '$success700',
        },
     '&:visited': {
          background: '$success900',
        },  
        '&:focus': {
          background: '$success600',
        }, 
      },
    },
    {
      type: 'success',
      variant: 'outlined',
      css: {
        color: '$success',
        borderColor: '$success',
        '&:hover': {
          background: '$success700',
        },
     '&:visited': {
          background: '$success900',
        },  
        '&:focus': {
          background: '$success600',
        }, 
      },
    },
    {
      type: 'success',
      variant: 'ghost',
      css: {
        color: '$success',
      },
    },
  ],
  defaultVariants: {
    size: 'medium',
    type: 'primary',
    variant: 'contained',
  },
});

const Content= styled('div', {
  flex:1,

  variants: {
    align : {
      'start' :{
        textAlign:'left'
      } ,
      'grow':{
        textAlign:'center'
      }
    },
    ml:{
      true:{
        marginLeft:'$8'
      }
    },
    mr:{
      true:{
        marginRight:'$8'
      }
    }
  },

  defaultVariants: {
    align: 'grow'
  },
});

export interface PropTypes {
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  fullWidth?: boolean;
  size?: 'small' | 'medium' | 'large';
  variant?: 'contained' | 'outlined' | 'ghost';
  type?: 'primary' | 'error' | 'warning' | 'success'; 
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  align?: 'start' | 'grow';
  loading?: boolean;
  disabled?: boolean;
}

function Button({
  children,
  loading,
  disabled,
  prefix,
  suffix,
  align,
  ...props
}: PropsWithChildren<PropTypes>) {
  return (
    <ButtonContainer disabled={disabled || loading} {...props}>
      {prefix}
      {children && <Content align={align} ml={!!prefix}  mr={!!suffix && !loading} >{children}</Content>}
      {loading && <Spinner size={16} color={'primary'}/>}
      {suffix}
    </ButtonContainer>
  );
}

export default Button;
