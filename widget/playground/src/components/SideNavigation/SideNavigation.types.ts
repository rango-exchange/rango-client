export interface TabPropTypes {
  variant: 'vertical' | 'horizontal';
  tabs: {
    content: React.ReactNode;
    disabled?: boolean;
    title?: string;
    id: string;
  }[];
  activeLayout: string;
  onChange: (id: string) => void;
}

export interface IconLinkPropTypes {
  icon: React.ReactNode;
  label: string;
  disabled?: boolean;
}
