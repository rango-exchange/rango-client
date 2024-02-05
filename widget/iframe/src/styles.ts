export function applyCommonStyles(element: HTMLIFrameElement) {
  element.style.width = '100vw';
  element.style.maxWidth = '390px';
  element.style.overflow = 'hidden';
  element.style.backgroundColor = 'transparent';
  element.style.border = 'none';
}

export function applyDefaultStyles(element: HTMLIFrameElement) {
  applyCommonStyles(element);
  element.style.height = '100vh';
  element.style.maxHeight = '700px';
}
export function applyDynamicHeightStyles(element: HTMLIFrameElement) {
  applyCommonStyles(element);
  // This is an initial value when widget hasn't been loaded completely.
  element.style.height = '390px';
}
