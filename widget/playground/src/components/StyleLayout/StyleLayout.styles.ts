import { styled } from '@rango-dev/ui';

export const Layout = styled('div', {
  borderRadius: '20px',
  display: 'flex',
  padding: '$15',
  backgroundColor: '$background',
  width: '338px',
  height: '100%',
  flexDirection: 'column',
});

export const GeneralContent = styled('div', {
  height: '474px',
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
