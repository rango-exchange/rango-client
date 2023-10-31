import React from 'react';

import { Typography } from '../../components';
import { styled } from '../../theme';

interface PropTypes {
  messages: string[];
}

const List = styled('ul', {
  padding: '$0 $0 $40 $0',
  margin: 0,
});

const ListItem = styled('li', {
  paddingBottom: '$10',
});

const Message = styled(Typography, {
  display: 'block',
});

export function BalanceErrors({ messages }: PropTypes) {
  return (
    <>
      <List>
        {messages.map((warning, index) => {
          const key = index + warning;
          return (
            <ListItem key={key}>
              <Message variant="body" size="medium" color="$neutral700">
                {warning}
              </Message>
            </ListItem>
          );
        })}
      </List>
    </>
  );
}
