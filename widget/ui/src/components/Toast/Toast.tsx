import type { ToastProps } from './Toast.types';

import React, { useEffect } from 'react';

import { IconHighlight } from '../Alert/Alert.styles';
import AlertIcon from '../Alert/AlertIcon';
import { Divider } from '../Divider';

import { useToast } from './Toast.Provider';
import {
  AlertBox,
  AlertFlexContainer,
  StyledTypography,
  ToastContentContainer,
} from './Toast.styles';

const DEFAULT_HIDE_DURATION = 3_000;

export const Toast = (props: ToastProps) => {
  const { id, horizontal, autoHideDuration = DEFAULT_HIDE_DURATION } = props;
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
    <ToastContentContainer horizontal={horizontal}>
      {'component' in props ? (
        props.component
      ) : (
        <AlertBox
          onClick={() => removeToast(id)}
          type={props.type}
          style={props.style}>
          <AlertFlexContainer>
            <IconHighlight type={props.type} align="center">
              <AlertIcon type={props.type} />
            </IconHighlight>
            <Divider direction="horizontal" size={10} />
            <StyledTypography
              variant="body"
              size="small"
              color={props.titleColor}
              hasColor={!!props.titleColor}
              align="left">
              {props.title}
            </StyledTypography>
          </AlertFlexContainer>
        </AlertBox>
      )}
    </ToastContentContainer>
  );
};
