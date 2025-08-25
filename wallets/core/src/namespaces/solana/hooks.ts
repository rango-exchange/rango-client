import type { ProviderAPI, SolanaActions } from './types.js';
import type { Subscriber, SubscriberCleanUp } from '../../mod.js';

import { builders } from './mod.js';

export function changeAccountSubscriber(
  instance: () => ProviderAPI
): [Subscriber<SolanaActions>, SubscriberCleanUp<SolanaActions>] {
  return builders.changeAccountSubscriber(instance).build();
}
