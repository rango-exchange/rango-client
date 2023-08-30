import { TextField } from '../../components';
import { styled } from '../../theme';

export const Container = styled('div', {
  backgroundColor: '$surface100',
  borderRadius: '$xm',
  padding: '$15',
  '& .label__container': {
    paddingBottom: '$5',
  },
  '& .label': {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  '& .balance': {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  '& .form': {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  '& .amount': {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'end',
    flexGrow: 1,
  },
});

export const InputAmount = styled(TextField, {
  padding: '0',
  fontSize: '$18',
  lineHeight: '$26',
  fontWeight: '$medium',
  textAlign: 'right',
  width: 140,
});
