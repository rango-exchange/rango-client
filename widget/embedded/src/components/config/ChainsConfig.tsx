import { Button, Spacer, styled, SwapContainer, Typography } from '@rangodev/ui';
import React from 'react';

interface PropTypes {
  title: string;
}

export function ChainsConfig({ title }: PropTypes) {
    console.log({title});
    
  return (
    <div>
      <Typography variant="h6">{title}</Typography>
      <Spacer size={12} scale="vertical" />
      <SwapContainer>
        
      </SwapContainer>
    </div>
  );
}
