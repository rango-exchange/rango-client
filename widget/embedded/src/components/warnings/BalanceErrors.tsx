import { Divider, styled, Typography } from '@rango-dev/ui';
import React from 'react';
import { i18n } from '@lingui/core';
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
      <Typography className="title" variant="title" color={'error'}>
        {i18n.t('Insufficent Balance:')}
      </Typography>
      <Divider size={8} />
      <List showListStyle={showListStyle}>
        {messages.map((warning, index) => (
          <ListItem showListStyle={showListStyle} key={index}>
            <Message variant="body2">{warning}</Message>
          </ListItem>
        ))}
      </List>
    </>
  );
}
