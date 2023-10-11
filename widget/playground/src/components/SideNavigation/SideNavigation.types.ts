import type { SIDE_TABS_IDS } from '../../constants';

export interface PropTypes {
  activeLayout: SIDE_TABS_IDS;
  onChange: (id: SIDE_TABS_IDS) => void;
}

export interface TabPropTypes extends PropTypes {
  variant: 'vertical' | 'horizontal';
  tabs: {
    content: React.ReactNode;
    disabled?: boolean;
    title?: string;
    id: SIDE_TABS_IDS;
  }[];
}

export interface IconLinkPropTypes {
  icon: React.ReactNode;
  label: string;
  disabled?: boolean;
}
