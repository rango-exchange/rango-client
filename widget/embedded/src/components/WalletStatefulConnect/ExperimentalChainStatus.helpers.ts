import type { PropTypes } from './ExperimentalChainStatus.types';
import type { MessageType } from '@arlert-dev/ui';

import { i18n } from '@lingui/core';

export function generateMessageByStatus(
  status: PropTypes['status'],
  blockchainDisplayName: string | undefined
): {
  type: MessageType;
  title: string;
  description: string;
} {
  switch (status) {
    case 'in-progress':
      return {
        type: 'loading',
        title: i18n.t({
          id: 'Add {blockchainDisplayName} Chain',
          values: { blockchainDisplayName },
        }),
        description: i18n.t({
          id: 'Please approve the experimental chain pop-up in your wallet.',
          values: { blockchainDisplayName },
        }),
      };
    case 'completed':
      return {
        type: 'success',
        title: i18n.t({
          id: '{blockchainDisplayName} Chain Added',
          values: { blockchainDisplayName },
        }),
        description: i18n.t({
          id: 'The {blockchainDisplayName} chain has been successfully added to your wallet.',
          values: { blockchainDisplayName },
        }),
      };
    case 'rejected':
      return {
        type: 'error',
        title: i18n.t('Request Rejected'),
        description: i18n.t({
          id: "You've rejected adding {blockchainDisplayName} chain to your wallet.",
          values: { blockchainDisplayName },
        }),
      };
    default:
      throw new Error(
        `Showing information about an experimentation chain status needs to be defined first. status: ${status}`
      );
  }
}
