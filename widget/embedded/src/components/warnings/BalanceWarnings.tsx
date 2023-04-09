import { styled, Typography } from '@rango-dev/ui';
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

export function BalanceWarnings({ messages }: PropTypes) {
  const showListStyle = messages.length > 1;
  return (
    <List showListStyle={showListStyle}>
      {messages.map((warning) => (
        <ListItem showListStyle={showListStyle}>
          <Message variant="body2">{warning}</Message>
        </ListItem>
      ))}
    </List>
  );
}
