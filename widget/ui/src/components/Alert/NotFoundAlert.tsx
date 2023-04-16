import React from 'react';
import { Alert } from './Alert';

interface PropTypes {
  catergory: string;
  searchedFor?: string;
}

export function NotFoundAlert(props: PropTypes) {
  const { catergory, searchedFor } = props;
  return (
    <Alert
      type="secondary"
      title={`${catergory} ${
        searchedFor ? "'" + searchedFor + "'" : ''
      } not found.`}
    />
  );
}
