import type { ChangeAccountSubscriberParams, SuiActions } from './types.js';
import type { Subscriber, SubscriberCleanUp } from '../../mod.js';

import { builders } from './mod.js';

export function changeAccountSubscriber(
  params: ChangeAccountSubscriberParams
): [Subscriber<SuiActions>, SubscriberCleanUp<SuiActions>] {
  return builders.changeAccountSubscriber({ name: params.name }).build();
}
