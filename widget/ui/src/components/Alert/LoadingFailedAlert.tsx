import { i18n } from '@lingui/core';
import React from 'react';

import { Alert } from './Alert';

/**
 * @deprecated Please use the Alert directly.
 */
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
