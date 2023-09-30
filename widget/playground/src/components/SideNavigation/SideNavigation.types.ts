export interface TabPropTypes {
  variant: 'vertical' | 'horizontal';
  tabs: {
    content: React.ReactNode;
    disabled?: boolean;
    title?: string;
  }[];
  defaultIndex?: number;
}

export interface IconLinkPropTypes {
  icon: React.ReactNode;
  label: string;
}
