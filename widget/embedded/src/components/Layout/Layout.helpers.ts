import { getContainer } from '../../utils/common';

export function onScrollContentAttachStatusToContainer(e: Event) {
  const contentElement = e.target as HTMLElement | null;

  if (contentElement) {
    const fromTop = contentElement.scrollTop;
    const container = getContainer();

    if (fromTop > 1) {
      container.classList.add('rng-scrolled');
    } else {
      container.classList.remove('rng-scrolled');
    }
  }
}
