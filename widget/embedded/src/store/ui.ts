import type { Watermark } from '../hooks/useFetchApiConfig';
import type { TabManagerInterface } from '../libs/tabManager';

import { create } from 'zustand';

import { TabManager } from '../libs/tabManager';

import createSelectors from './selectors';

interface UiState {
  isActiveTab: boolean;
  tabManagerInitiated: boolean;
  showActivateTabModal: boolean;
  watermark: Watermark;
  activateCurrentTab: (
    setCurrentTabAsActive: () => void,
    hasRunningSwaps: boolean
  ) => void;
  setShowActivateTabModal: (flag: boolean) => void;
  setWatermark: (watermark: Watermark) => void;
}

export const useUiStore = createSelectors(
  create<UiState>()((set, get) => ({
    isActiveTab: false,
    tabManagerInitiated: false,
    showActivateTabModal: false,
    watermark: 'NONE',
    fetchingApiConfig: false,
    activateCurrentTab: (setCurrentTabAsActive, hasRunningSwaps) => {
      const { showActivateTabModal } = get();

      if (!showActivateTabModal && hasRunningSwaps) {
        set({ showActivateTabModal: true });
      } else if (showActivateTabModal || !hasRunningSwaps) {
        setCurrentTabAsActive();
      }
    },
    setShowActivateTabModal: (flag) => {
      set({ showActivateTabModal: flag });
    },
    setWatermark: (watermark) => {
      set({ watermark });
    },
  }))
);

export const tabManager: TabManagerInterface = new TabManager({
  onInit: () => useUiStore.setState({ tabManagerInitiated: true }),
  onClaim: () =>
    useUiStore.setState({ isActiveTab: true, showActivateTabModal: false }),
  onRelease: () => useUiStore.setState({ isActiveTab: false }),
});
