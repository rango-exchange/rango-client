import type { TokenWithBalance } from './TokenList.types';

import { containsText } from '../../utils/common';

export const filterTokens = (list: TokenWithBalance[], searchedFor: string) =>
  list
    .filter(
      (token) =>
        containsText(token.symbol, searchedFor) ||
        containsText(token.address || '', searchedFor) ||
        containsText(token.name || '', searchedFor)
    )
    .sort((a, b) => (b.pin as any) - (a.pin as any));
