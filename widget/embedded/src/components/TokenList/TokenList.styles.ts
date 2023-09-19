import { styled, Typography } from '@rango-dev/ui';

export const Title = styled('div', {
  display: 'flex',
  alignItems: 'center',
  '._typography': {
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    maxWidth: 100,
    overflow: 'hidden',
  },
});
export const List = styled('ul', {
  minHeight: 280,
  padding: 0,
  margin: 0,
  listStyle: 'none',
  '& li': {
    alignItems: 'none',
    '.description': {
      position: 'relative',
      height: 12,
      width: 150,
      '.token-title': {
        position: 'absolute',
        transform: 'none',
        transition: 'transform 225ms cubic-bezier(0, 0, 0.2, 1) 0ms',
        bottom: '-8px',
      },

      '.token-address': {
        transform: 'translateY(12px)',
        visibility: 'hidden',
        '& a': {
          fontSize: '$12',
          lineHeight: '$16',
          color: '$neutral800',
          textDecoration: 'none',
        },
      },
      '.token-name': {
        position: 'absolute',
        transform: 'none',
        transition: 'transform 225ms cubic-bezier(0, 0, 0.2, 1) 0ms',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        maxWidth: 100,
        overflow: 'hidden',
      },
    },
    '&:hover': {
      '.description': {
        '.token-address': {
          position: 'absolute',
          transform: 'none',
          transition: 'transform 225ms cubic-bezier(0, 0, 0.2, 1) 0ms',
          visibility: 'visible',
        },
        '.token-address-without-name': {
          bottom: '-15px',
        },
        '.token-name': {
          position: 'absolute',
          transform: 'translateY(-12px)',
          visibility: 'hidden',
        },
        '.token-title': {
          position: 'absolute',
          transform: 'translateY(-12px)',
          bottom: '-10px',
        },
      },
    },
  },
});

export const Tag = styled('div', {
  paddingLeft: '$5',
  paddingRight: '$5',
  borderRadius: '$md',
  display: 'flex',
  alignItems: 'center',
});

export const TagTitle = styled(Typography, {});

export const BalanceContainer = styled('div', {
  textAlign: 'right',
});

export const End = styled('ul', {
  display: 'flex',
  alignItems: 'end',
  flexDirection: 'column',
});

export const Description = styled('div', {
  display: 'flex',
  alignItems: 'center',
});
export const ImageSection = styled('div', {
  position: 'relative',
  '.image-container': {
    borderRadius: '$xm',
    overflow: 'hidden',
  },
});
export const Pin = styled('div', {
  position: 'absolute',
  backgroundColor: '$neutral100',
  padding: '$4',
  borderRadius: '50%',
  bottom: -6,
  right: -6,
});
