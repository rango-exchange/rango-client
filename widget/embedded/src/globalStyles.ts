import { globalCss } from '@rango-dev/ui';

export const globalStyles = globalCss({
  '*': {
    boxSizing: 'border-box',
    margin: 0,
    padding: 0,
    listStyleType: 'none',
    '&::-webkit-scrollbar': { width: '$8', height: '$8' },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '$neutrals400',
      borderRadius: '$10',
    },
    '&::-webkit-scrollbar-thumb:hover': {
      backgroundColor: '$neutrals500',
    },
    '&::-webkit-scrollbar-track': {
      backgroundColor: '$neutrals300',
    },
  },
});
export const globalFont = (fontFamily: string) =>
  globalCss({
    '@import': [
      "url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap')",
      "url('https://fonts.cdnfonts.com/css/times-new-roman')",
    ],
    body: {
      fontFamily,
    },
  })();
