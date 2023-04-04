import { create } from 'zustand';
import createSelectors from './selectors';

interface UiState {
  connectWalletsButtonDisabled: boolean;
  selectedSwapRequestId: string | null;
  toggleConnectWalletsButton: () => void;
  setSelectedSwap: (requestId: string | null) => void;
}

export const useUiStore = createSelectors(
  create<UiState>()((set) => ({
    connectWalletsButtonDisabled: false,
    selectedSwapRequestId: null,
    toggleConnectWalletsButton: () =>
      set((state) => ({
        connectWalletsButtonDisabled: !state.connectWalletsButtonDisabled,
      })),
    setSelectedSwap: (requestId) => set({ selectedSwapRequestId: requestId }),
  }))
);
