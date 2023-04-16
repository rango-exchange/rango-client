import React from 'react';
import { Alert } from './Alert';

export function LoadingFailedAlert() {
  return (
    <Alert
      type="error"
      title=" Error connecting server, please reload the app and try again."
    />
  );
}
