import type { PropTypes } from './Alert.types';

import React from 'react';

import { Complete, Error, InfoError, Warning } from '../../icons';

function AlertIcon(props: Pick<PropTypes, 'type'>) {
  switch (props.type) {
    case 'success':
      return <Complete color={props.type} size={12} />;
    case 'warning':
      return <Warning color={props.type} size={12} />;
    case 'error':
      return <Error color={props.type} size={12} />;
    default:
      return <InfoError color={props.type} size={12} />;
  }
}

export default AlertIcon;
