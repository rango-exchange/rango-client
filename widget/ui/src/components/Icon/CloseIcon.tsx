import { styled } from '../../theme';
import { AddIcon } from './AddIcon';

export const CloseIcon = styled(AddIcon, {
  transform: 'rotate(45deg)',
  cursor: 'pointer',
});

CloseIcon.toString = () => '._icon';
