import { globalCss } from '@rango-dev/ui';

export const globalFont = () =>
  globalCss({
    '@import': [
      "url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap')",
      "url('https://fonts.cdnfonts.com/css/times-new-roman')",
    ],
  })();
