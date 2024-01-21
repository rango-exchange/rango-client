import { styled } from '@rango-dev/ui';

const PageContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  padding: '20px 20px 10px',
  flexGrow: 1,

  variants: {
    view: {
      true: {
        flexGrow: 1,
        overflow: 'hidden',
      },
    },
    compact: {
      true: {
        padding: 0,
      },
    },
  },
});

export { PageContainer };
