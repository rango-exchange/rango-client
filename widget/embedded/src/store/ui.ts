import { create } from 'zustand';
import createSelectors from './selectors';

interface UiState {
  connectWalletsButtonDisabled: boolean;
  selectedSwapRequestId: string | null;
  currentPage: string;
  toggleConnectWalletsButton: () => void;
  setSelectedSwap: (requestId: string | null) => void;
  setCurrentPage: (path: string) => void;
}

export const useUiStore = createSelectors(
  create<UiState>()((set) => ({
    connectWalletsButtonDisabled: false,
    selectedSwapRequestId: null,
    currentPage: '',
    toggleConnectWalletsButton: () =>
      set((state) => ({
        connectWalletsButtonDisabled: !state.connectWalletsButtonDisabled,
      })),
    setSelectedSwap: (requestId) => set({ selectedSwapRequestId: requestId }),
    setCurrentPage: (path) => set({ currentPage: path }),
  }))
);
