import type { PropTypes } from './MessageBox.types';

import React from 'react';

import {
  CompleteIcon,
  ErrorIcon,
  InfoErrorIcon,
  LoadingIcon,
  WarningIcon,
} from '../../icons';

function StatusIcon(props: Pick<PropTypes, 'type'>) {
  switch (props.type) {
    case 'success':
      return <CompleteIcon color={props.type} size={30} />;
    case 'warning':
      return <WarningIcon color={props.type} size={30} />;
    case 'error':
      return <ErrorIcon color={props.type} size={30} />;
    case 'loading':
      return <LoadingIcon color="info" size={30} />;
    default:
      return <InfoErrorIcon color={props.type} size={30} />;
  }
}

export default StatusIcon;
