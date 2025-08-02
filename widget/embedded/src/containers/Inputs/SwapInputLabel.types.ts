export type PropTypes = {
  label: string;
  onClickWallet: () => void;
  relatedWallet: {
    address: string;
    type: string;
    image: string;
  } | null;
};
