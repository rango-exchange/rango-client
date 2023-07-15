import React from 'react';
import { i18n } from '@lingui/core';
import { Alert } from './Alert';

export function LoadingFailedAlert() {
  return (
    <Alert
      type="error"
      title={i18n.t(
        ' Error connecting server, please reload the app and try again.'
      )}
    />
  );
}
