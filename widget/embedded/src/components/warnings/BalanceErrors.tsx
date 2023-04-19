import { Spacer, styled, Typography } from '@rango-dev/ui';
import React from 'react';

interface PropTypes {
  messages: string[];
}

const List = styled('ul', {
  variants: {
    showListStyle: {
      true: { paddingLeft: '$24' },
    },
  },
});

const ListItem = styled('li', {
  variants: {
    showListStyle: {
      true: { listStyleType: 'disc', listStylePosition: 'outside' },
    },
  },
});

const Message = styled(Typography, {
  display: 'block',
});

export function BalanceErrors({ messages }: PropTypes) {
  const showListStyle = messages.length > 1;
  return (
    <>
      <Typography className="title" variant="h7" color={'error'}>
        Insufficent Balance:
      </Typography>
      <Spacer size={8} direction="vertical" />
      <List showListStyle={showListStyle}>
        {messages.map((warning) => (
          <ListItem showListStyle={showListStyle}>
            <Message variant="body3">- {warning}</Message>
          </ListItem>
        ))}
      </List>
    </>
  );
}