import type { PropTypes } from './MessageBox.types.js';

import React from 'react';

import {
  CompleteIcon,
  ErrorIcon,
  InfoErrorIcon,
  WarningIcon,
} from '../../icons/index.js';
import { Spinner } from '../Spinner/index.js';

function StatusIcon(props: Pick<PropTypes, 'type'>) {
  switch (props.type) {
    case 'success':
      return <CompleteIcon color={props.type} size={30} />;
    case 'warning':
      return <WarningIcon color={props.type} size={30} />;
    case 'error':
      return <ErrorIcon color={props.type} size={30} />;
    case 'loading':
      return <Spinner color="info" size={30} />;
    default:
      return <InfoErrorIcon color={props.type} size={30} />;
  }
}

export default StatusIcon;
