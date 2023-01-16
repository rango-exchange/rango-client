import React from 'react';
import { keyframes, styled } from '../../theme';

const spin = keyframes({
  '100%': {
    transform: 'rotate(360deg)',
  },
});

const SpinnerContainer = styled('div', {
 
  borderRadius: '50%',
  position: 'relative',
  border: `2px solid $neutrals300`,
  borderRight: `2px solid`,
  animation: `${spin} 1.5s linear infinite`,
  margin: `0px $8`,
  variants: {
    color: {
      primary: {
        borderRightColor:'$primary'
      },
      error: {
        borderRightColor:'$error'
      },
      warning: {
        borderRightColor:'$warning'
      },
      success: {
        borderRightColor:'$success'
      },
      black:{
        borderRightColor:'$black'
      },
      white:{
        borderRightColor:'$white'
      }
    },

    size:{
      16:{
        width: '$16',
        height: '$16', 
      },
      20:{
        width: '$20',
        height: '$20', 
      },
      24:{
        width: '$24',
        height: '$24', 
      }
    }
  },

});
export interface PropTypes {
  size?: 16 | 20 | 24; 
  color?: 'primary' | 'error' | 'warning' | 'success' | 'black' | 'white'; 
}

function Spinner({
  size =16 , 
  color= 'primary' ,

}:PropTypes) {
  console.log({size, color});
  
  return <SpinnerContainer  size={size} color={color}/>;
}

export default Spinner;
