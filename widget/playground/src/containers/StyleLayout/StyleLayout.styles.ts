import { Button, Collapsible, darkTheme, styled } from '@arlert-dev/ui';

export const GeneralContainer = styled('div', {
  backgroundColor: '$background',
  borderRadius: '$sm',
  border: '1px solid $neutral300',
  padding: '$15',
});

export const Field = styled('div', {
  display: 'flex',
  flexDirection: 'column',
});

export const FieldTitle = styled('div', {
  display: 'flex',
});

export const PresetContent = styled('div', {
  display: 'grid',
  gap: 5,
});
export const PresetTheme = styled(Button, {
  border: '1px solid',
  borderRadius: '$sm',
  padding: '$10 0',
  height: '36px',
  position: 'relative',
  backgroundColor: 'transparent',
  '._text': {
    width: '100%',
  },
  '&:hover': {
    borderColor: '$secondary200',
  },
  variants: {
    isSelected: {
      true: {
        borderColor: '$secondary500',
      },
      false: {
        $$color: '$colors$neutral300',
        [`.${darkTheme} &`]: {
          $$color: '$colors$neutral400',
        },
        borderColor: '$$color',
      },
    },
  },
});

export const ColorsContent = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'relative',
});

export const ColoredCircle = styled('div', {
  width: '$20',
  height: '$20',
  borderRadius: '$sm',
  margin: '$5',
  boxShadow: '0 2px 6px 0 rgba(0, 0, 0, 0.1), 0 4px 10px 0 rgba(0, 0, 0, 0.16)',
  variants: {
    position: {
      relative: {
        position: 'relative',
      },
      absolute: {
        position: 'absolute',
      },
    },
  },
});

export const Row = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});

export const Line = styled('div', {
  width: '100%',
  borderTop: '1px solid $neutral300',
});

export const CustomColors = styled(Button, {
  width: '100%',
  borderRadius: 0,
  display: 'flex',
  justifyContent: 'space-between',
  backgroundColor: 'transparent',
  variants: {
    isDisabled: {
      false: {
        '&:hover': {
          '.title': {
            color: '$secondary500',
          },
          '& svg': {
            color: '$secondary500',
          },
        },
      },
      true: {
        '.title': {
          color: '$neutral600',
        },
        '& svg': {
          color: '$neutral600',
        },
      },
    },
  },
});

export const Collapse = styled('div', {
  overflow: 'hidden',
  transition: 'height .3s ease',
});

export const CustomColorCollapsible = styled(Collapsible, {
  border: '1px solid $neutral300',
  borderRadius: '$xm',
  padding: '$4 $15',
  cursor: 'pointer',
  '&:hover': {
    borderColor: '$secondary200',
    '& svg': {
      color: '$secondary500',
    },
  },
});

export const MoreButtonContent = styled('div', {
  display: 'flex',
  justifyContent: 'center',
});
