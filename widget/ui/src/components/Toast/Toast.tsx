import type { ToastPropTypes } from './Toast.types';

import React, { useEffect } from 'react';

import { Alert } from '../Alert';
import { Typography } from '../Typography';

import { useToast } from './Toast.Provider';
import { AlertContainer, Container } from './Toast.styles';

const DEFAULT_HIDE_DURATION = 3_000;

export const Toast = (props: ToastPropTypes) => {
  const {
    id,
    horizontal,
    type,
    title,
    autoHideDuration = DEFAULT_HIDE_DURATION,
  } = props;
  const { removeToast } = useToast();
  useEffect(() => {
    const timer = setTimeout(() => {
      removeToast(id);
    }, autoHideDuration);

    return () => {
      clearTimeout(timer);
    };
  }, [id]);

  return (
    <Container horizontal={horizontal}>
      <AlertContainer onClick={() => removeToast(id)} type={type}>
        <Alert
          type={type}
          title={
            <Typography
              variant="body"
              size="small"
              color="neutral700"
              align="left">
              {title}
            </Typography>
          }
        />
      </AlertContainer>
    </Container>
  );
};
