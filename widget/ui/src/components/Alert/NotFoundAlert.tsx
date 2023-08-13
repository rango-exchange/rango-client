import React from 'react';

import { Alert } from './Alert';

interface PropTypes {
  catergory: string;
  searchedFor?: string;
}

/**
 * @deprecated Please use the Alert directly.
 */
export function NotFoundAlert(props: PropTypes) {
  const { catergory, searchedFor } = props;
  return (
    <Alert
      type="error"
      title={`${catergory} ${
        searchedFor ? "'" + searchedFor + "'" : ''
      } not found.`}
    />
  );
}
