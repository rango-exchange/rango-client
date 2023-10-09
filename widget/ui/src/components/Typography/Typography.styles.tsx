import { styled } from '../../theme';

export const TypographyContainer = styled('span', {
  display: 'inline-block',
  variants: {
    variant: {
      display: {},
      headline: {},
      title: {},
      label: {},
      body: {},
    },
    size: {
      large: {},
      medium: {},
      xmedium: {},
      small: {},
      xsmall: {},
    },
    align: {
      center: {
        textAlign: 'center',
      },
      left: {
        textAlign: 'left',
      },
      right: {
        textAlign: 'right',
      },
    },
    noWrap: {
      true: {
        whiteSpace: 'nowrap',
      },
    },
    ml: {
      2: {
        marginLeft: '$2',
      },
      4: {
        marginLeft: '$4',
      },
      8: {
        marginLeft: '$8',
      },
      12: {
        marginLeft: '$12',
      },
    },
    mt: {
      2: {
        marginTop: '$2',
      },
      4: {
        marginTop: '$4',
      },
      8: {
        marginTop: '$8',
      },
      12: {
        marginTop: '$12',
      },
    },
    mr: {
      2: {
        marginRight: '$2',
      },
      4: {
        marginRight: '$4',
      },
      8: {
        marginRight: '$8',
      },
      12: {
        marginRight: '$12',
      },
    },
    mb: {
      2: {
        marginBottom: '$2',
      },
      4: {
        marginBottom: '$4',
      },
      8: {
        marginBottom: '$8',
      },
      12: {
        marginBottom: '$12',
      },
    },
  },

  compoundVariants: [
    {
      size: 'large',
      variant: 'display',
      css: {
        fontSize: '$48',
        fontWeight: '$semiBold',
        lineHeight: '$64',
      },
    },
    {
      size: 'medium',
      variant: 'display',
      css: {
        fontSize: '$40',
        fontWeight: '$semiBold',
        lineHeight: '$52',
      },
    },
    {
      size: 'small',
      variant: 'display',
      css: {
        fontSize: '$36',
        fontWeight: '$semiBold',
        lineHeight: '$44',
      },
    },

    {
      size: 'large',
      variant: 'headline',
      css: {
        fontSize: '$32',
        fontWeight: '$semiBold',
        lineHeight: '$40',
      },
    },
    {
      size: 'medium',
      variant: 'headline',
      css: {
        fontSize: '$38',
        fontWeight: '$semiBold',
        lineHeight: '$36',
      },
    },
    {
      size: 'small',
      variant: 'headline',
      css: {
        fontSize: '$22',
        fontWeight: '$semiBold',
        lineHeight: '$30',
      },
    },
    {
      size: 'xsmall',
      variant: 'headline',
      css: {
        fontSize: '$20',
        fontWeight: '$semiBold',
        lineHeight: '$28',
      },
    },

    {
      size: 'large',
      variant: 'title',
      css: {
        fontSize: '$22',
        fontWeight: '$medium',
        lineHeight: '$28',
      },
    },
    {
      size: 'medium',
      variant: 'title',
      css: {
        fontSize: '$18',
        fontWeight: '$medium',
        lineHeight: '$26',
      },
    },
    {
      size: 'xmedium',
      variant: 'title',
      css: {
        fontSize: '$16',
        fontWeight: '$medium',
        lineHeight: '$24',
      },
    },
    {
      size: 'small',
      variant: 'title',
      css: {
        fontSize: '$14',
        fontWeight: '$medium',
        lineHeight: '$20',
      },
    },

    {
      size: 'large',
      variant: 'label',
      css: {
        fontSize: '$14',
        fontWeight: '$medium',
        lineHeight: '$20',
      },
    },
    {
      size: 'medium',
      variant: 'label',
      css: {
        fontSize: '$12',
        fontWeight: '$medium',
        lineHeight: '$16',
      },
    },
    {
      size: 'small',
      variant: 'label',
      css: {
        fontSize: '$10',
        fontWeight: '$medium',
        lineHeight: '$16',
      },
    },

    {
      size: 'large',
      variant: 'body',
      css: {
        fontSize: '$16',
        fontWeight: '$regular',
        lineHeight: '$24',
      },
    },
    {
      size: 'medium',
      variant: 'body',
      css: {
        fontSize: '$14',
        fontWeight: '$regular',
        lineHeight: '$20',
      },
    },
    {
      size: 'small',
      variant: 'body',
      css: {
        fontSize: '$12',
        fontWeight: '$regular',
        lineHeight: '$16',
      },
    },
    {
      size: 'xsmall',
      variant: 'body',
      css: {
        fontSize: '$10',
        fontWeight: '$regular',
        lineHeight: '$12',
      },
    },
  ],
});
