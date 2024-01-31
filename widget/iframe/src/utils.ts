// URL.canParse hasn't good support yet, so using a polyfill if it's not available.
export function canParse(url: string) {
  if ('canParse' in window.URL) {
    return URL.canParse(url);
  }
  try {
    return !!new URL(url);
  } catch (error) {
    return false;
  }
}
