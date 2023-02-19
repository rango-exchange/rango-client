import { globalCss } from '@rangodev/ui';

export const globalStyles = globalCss({
  '*': {
    '&::-webkit-scrollbar': { width: '$8' },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '$neutrals400',
    },
    '&::-webkit-scrollbar-thumb:hover': {
      backgroundColor: '$neutrals500',
    },
    '&::-webkit-scrollbar-track': {
      backgroundColor: '$neutrals300',
    },
  },
});
