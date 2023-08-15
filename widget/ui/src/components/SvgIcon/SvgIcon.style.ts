import { styled } from '../../theme';

export const SvgWithColor = styled('svg', {
  color: '$icons_primary',
  variants: {
    color: {
      primary: {
        color: '$icons_primary',
      },
      secondary: {
        color: '$icons_secondary',
      },
      error: {
        color: '$status_error-foreground',
      },
      warning: {
        color: '$status_warning-foreground',
      },
      success: {
        color: '$status_success-foreground',
      },
      info: {
        color: '$status_info-foreground',
      },
      progressing: {
        color: '$ cicons_progressing',
      },
      disable: {
        color: '$icons_primary-variant',
      },
      active: {
        color: '$icons_active',
      },
    },
  },
});
