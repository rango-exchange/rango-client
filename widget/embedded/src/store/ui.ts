import { create } from 'zustand';
import createSelectors from './selectors';

interface UiState {
  connectWalletsButtonDisabled: boolean;
  toggleConnectWalletsButton: () => void;
}

export const useUiStore = createSelectors(
  create<UiState>()((set) => ({
    connectWalletsButtonDisabled: false,
    toggleConnectWalletsButton: () =>
      set((state) => ({ connectWalletsButtonDisabled: !state.connectWalletsButtonDisabled })),
  })),
);
