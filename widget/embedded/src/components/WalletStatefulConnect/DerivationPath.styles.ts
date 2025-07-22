import { Button, styled, Typography } from '@arlert-dev/ui';

export const InputsContainer = styled('div', {
  paddingTop: '$30',
  paddingBottom: '$30',
  zIndex: 10, // This property is added to solve inconsistency between Select child of this component and subsequent button
});

export const InputLabel = styled(Typography, {
  paddingLeft: '$10',
});

export const derivationPathInputStyles = {
  height: '$40',
  backgroundColor: '$neutral200',
  borderRadius: '$sm',
};

export const StyledButton = styled(Button, {
  minHeight: '$40',
});
