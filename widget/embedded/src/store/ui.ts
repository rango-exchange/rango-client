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
  showProfileBanner: boolean;
  showCompactTokenSelector: boolean;
  activateCurrentTab: (
    setCurrentTabAsActive: () => void,
    hasRunningSwaps: boolean
  ) => void;
  setShowActivateTabModal: (flag: boolean) => void;
  setWatermark: (watermark: Watermark) => void;
  setShowProfileBanner: (showProfileBanner: boolean) => void;
  setShowCompactTokenSelector: (showCompactTokenSelector: boolean) => void;
}

export const useUiStore = createSelectors(
  create<UiState>()((set, get) => ({
    isActiveTab: false,
    tabManagerInitiated: false,
    showActivateTabModal: false,
    watermark: 'NONE',
    showProfileBanner: false,
    fetchingApiConfig: false,
    showCompactTokenSelector: false,
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
    setShowProfileBanner: (showProfileBanner) => {
      set({ showProfileBanner });
    },
    setShowCompactTokenSelector: (showCompactTokenSelector) => {
      set({ showCompactTokenSelector });
    },
  }))
);

export const tabManager: TabManagerInterface = new TabManager({
  onInit: () => useUiStore.setState({ tabManagerInitiated: true }),
  onClaim: () =>
    useUiStore.setState({ isActiveTab: true, showActivateTabModal: false }),
  onRelease: () => useUiStore.setState({ isActiveTab: false }),
});
