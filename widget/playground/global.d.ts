/* eslint-disable @typescript-eslint/no-explicit-any */
export {};

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
    gtag: (...args: any[]) => void;
  }
}
