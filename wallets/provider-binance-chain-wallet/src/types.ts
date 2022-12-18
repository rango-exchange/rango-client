export interface RequestedAccount {
  id: string;
  name: string;
  icon: string;
  type: string;
  addresses: {
    type: string;
    address: string;
  }[];
}
