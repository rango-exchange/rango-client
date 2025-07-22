import type { Layer } from '@arlert-dev/logging-types';
import type { captureException, Scope, withScope } from '@sentry/browser';

import { levelToSentryLevels } from './helpers';

type Client = {
  withScope: typeof withScope;
  captureException: typeof captureException;
};

export function layer(client: Client): Layer {
  return {
    handler(payload) {
      client.withScope((scope) => {
        const level = levelToSentryLevels(payload.level);
        scope.setLevel(level);

        if (payload.data?.context) {
          scope.setContext('logging', payload.data.context);
        }

        if (payload.data?.tags) {
          // eslint-disable-next-line @typescript-eslint/no-magic-numbers
          const tags = payload.data.tags as Parameters<Scope['setTags']>[0];
          scope.setTags(tags);
        }
        /*
         * https://forum.sentry.io/t/error-object-details-not-showing-up-in-sentry/7081/3
         * We could use this to capture normalized error fields in sentry
         */
        scope.setExtra('error', payload.message);
        client.captureException(payload.message);
      });
    },
  };
}
