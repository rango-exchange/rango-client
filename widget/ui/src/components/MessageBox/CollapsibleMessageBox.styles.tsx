import * as Collapsible from '@radix-ui/react-collapsible';

import { styled } from '../../theme';

export const Trigger = styled(Collapsible.Trigger, {
  padding: '$15',
  paddingBottom: '$5',
  borderRadius: '$xm',
  cursor: 'pointer',
  backgroundColor: '$neutral200',
  textAlign: 'center',
  border: 0,
  width: '100%',
  '&:hover': {
    backgroundColor: '$surface600',
  },
});
