import { globalCss } from '@rango-dev/ui';

export const globalStyles = globalCss({
  '*': {
    '&::-webkit-scrollbar': { width: '$8', height: '$8' },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '$neutral400',
    },
    '&::-webkit-scrollbar-thumb:hover': {
      backgroundColor: '$neutral500',
    },
    '&::-webkit-scrollbar-track': {
      backgroundColor: '$background',
    },
    '&::-webkit-scrollbar-corner': {
      backgroundColor: '$neutral200',
    },
  },
});
