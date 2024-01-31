export function isAppLoadedIntoIframe() {
  return window.self !== window.top;
}
