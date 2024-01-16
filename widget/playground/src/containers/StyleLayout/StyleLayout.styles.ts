import { Button, Collapsible, darkTheme, styled } from '@rango-dev/ui';

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

export const Tabs = styled('div', {
  borderRadius: '$xm',
  backgroundColor: '$neutral100',
  display: 'flex',
  border: '3px solid $neutral100',
  flexDirection: 'row',
  position: 'relative',
});

export const Tab = styled(Button, {
  color: '$neutral700',
  backgroundColor: 'transparent',
  zIndex: 10,
  variants: {
    isActive: {
      true: {
        transition: 'color 0.8s linear',
        $$color: '$colors$background',
        [`.${darkTheme} &`]: {
          color: '$colors$foreground',
        },
        color: '$$color',
      },
      false: {
        '&:hover': {
          backgroundColor: '$info100',
          color: '$secondary500',
          [`.${darkTheme} &`]: {
            backgroundColor: 'transparent',
            color: '$neutral700',
          },
        },
      },
    },
  },
});

export const BackdropTab = styled('div', {
  width: '80px',
  height: '$28',
  padding: '$4',
  backgroundColor: '$secondary500',
  position: 'absolute',
  borderRadius: '$md',
  inset: 0,
  transition: 'transform 0.2s cubic-bezier(0, 0, 0.86, 1.2)',
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
    borderColor: '$info300',
  },
  variants: {
    isSelected: {
      true: {
        borderColor: '$secondary500',
      },
      false: {
        borderColor: '$neutral300',
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
  '&:hover': {
    '.title': {
      color: '$secondary500',
    },
    '& svg': {
      color: '$secondary500',
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
    borderColor: '$info300',
    '& svg': {
      color: '$secondary500',
    },
  },
});

export const MoreButtonContent = styled('div', {
  display: 'flex',
  justifyContent: 'center',
});
