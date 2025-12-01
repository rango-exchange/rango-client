import type { TextFieldPropTypes } from '@rango-dev/ui';

import { styled } from '@rango-dev/ui';

export const getTextFieldStyles = (
  active: boolean,
  error: boolean
): TextFieldPropTypes['style'] => {
  const textFieldStyles: TextFieldPropTypes['style'] = {
    padding: 10,
    borderRadius: '$sm',

    '&:focus-within': {
      borderColor: '$secondary',
    },
  };

  if (!active) {
    textFieldStyles.backgroundColor = '$neutral100';
    textFieldStyles.color = '$neutral700';
  }

  if (!error) {
    textFieldStyles.borderColor = '$neutral';
  }

  return textFieldStyles;
};

export const Container = styled('div', {
  padding: '$20',

  '& ._icon-button': {
    backgroundColor: '$neutral600',
  },
});

export const Separator = styled('div', {
  width: '100%',
  borderBottom: '1px $neutral solid',
  position: 'relative',

  '& ._typography': {
    padding: '0 $8',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%,-50%)',
    backgroundColor: '$background',
  },
});
