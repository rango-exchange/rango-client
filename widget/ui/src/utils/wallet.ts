import type { InstallObjects } from '@rango-dev/wallets-react';

function isBrave() {
  let isBrave = false;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const nav: any = navigator;
  if (nav.brave && nav.brave.isBrave) {
    nav.brave.isBrave().then((res: boolean) => {
      if (res) {
        isBrave = true;
      }
    });
  }

  return isBrave;
}

export function detectInstallLink(install: InstallObjects | string): string {
  if (typeof install !== 'object') {
    return install;
  }
  let link;
  if (isBrave()) {
    link = install.BRAVE;
  } else if (navigator.userAgent?.toLowerCase().indexOf('chrome') !== -1) {
    link = install.CHROME;
  } else if (navigator.userAgent?.toLowerCase().indexOf('firefox') !== -1) {
    link = install.FIREFOX;
  } else if (navigator.userAgent?.toLowerCase().indexOf('edge') !== -1) {
    link = install.EDGE;
  }
  return link || install.DEFAULT;
}
