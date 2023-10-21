export interface PropTypes {
  title: string;
  icon: React.ReactNode;
  defaultValue?: string | null;
  onChange: (item: string) => void;
  list: { name: string; value: string | null; image?: string }[];
  searchPlaceholder?: string;
}
