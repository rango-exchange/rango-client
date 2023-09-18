import React from 'react';

import { Typography } from '../../components';
import { styled } from '../../theme';

interface PropTypes {
  messages: string[];
}

const List = styled('ul', {
  padding: 0,
  margin: 0,
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
      <List showListStyle={showListStyle}>
        {messages.map((warning, index) => {
          const key = index + warning;
          return (
            <ListItem showListStyle={showListStyle} key={key}>
              <Message variant="body" size="medium" color="$neutral500">
                {warning}
              </Message>
            </ListItem>
          );
        })}
      </List>
    </>
  );
}
