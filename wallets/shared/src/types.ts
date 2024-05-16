interface EIP6963ProviderInfo {
  uuid: string;
  name: string;
  icon: string;
  rdns: string;
}

interface EIP6963ProviderDetail {
  info: EIP6963ProviderInfo;

  /**
   * Currently, we are not enforcing strict types for providers in our usage.
   * Later, we can update the 'any' type to 'EIP1193Provider'.
   * https://eips.ethereum.org/EIPS/eip-6963
   *
   */
  provider: any;
}

export interface EIP6963AnnounceProviderEvent extends CustomEvent {
  type: 'eip6963:announceProvider';
  detail: EIP6963ProviderDetail;
}
