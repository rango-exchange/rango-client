import type { PropTypes } from './Alert.types';

import React from 'react';

import {
  CompleteIcon,
  ErrorIcon,
  InfoErrorIcon,
  WarningIcon,
} from '../../icons';
import { Spinner } from '../Spinner';

function AlertIcon(props: Pick<PropTypes, 'type'>) {
  switch (props.type) {
    case 'success':
      return <CompleteIcon color={props.type} size={12} />;
    case 'warning':
      return <WarningIcon color={props.type} size={12} />;
    case 'error':
      return <ErrorIcon color={props.type} size={12} />;
    case 'loading':
      return <Spinner color="info" size={12} />;
    default:
      return <InfoErrorIcon color={props.type} size={12} />;
  }
}

export default AlertIcon;
