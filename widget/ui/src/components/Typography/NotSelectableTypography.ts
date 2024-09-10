import { styled } from '../../theme.js';

import { Typography } from './Typography.js';

export const NotSelectableTypography = styled(Typography, {
  userSelect: 'none',
});
