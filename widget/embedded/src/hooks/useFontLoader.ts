import { useState } from 'react';

import { getFontUrlByName } from '../utils/common';
/*
 *TODO:
 * Loading fonts from JS has a downside and it is the bundle needs to be downloaded and executed first which means after sometime font will be added to <head /> and it causes a layoutshift each time.
 * We've added Roboto into <head /> since it's the default font. the downside here is it will load roboto anyway even dApp has set fontFamily other than Roboto which causes an unneccerary downloand (Roboto).
 * We decided to go with the second one and it can be solved in future by split these types of configs into a separate js file and let it to be loaded with a more priority than the main bundle. it should be also cached which imrpove user experience after first load.
 */
const useFontLoader = () => {
  const [fontLink, setFontLink] = useState<HTMLLinkElement | null>(null);

  const loadFont = (fontUrl: string) => {
    const link = document.createElement('link');
    link.href = fontUrl;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return link;
  };

  const unloadFont = () => {
    if (fontLink) {
      document.head.removeChild(fontLink);
      setFontLink(null);
    }
  };

  const handleLoadCustomFont = (fontName: string) => {
    unloadFont(); // Remove previous font
    const fontUrl = getFontUrlByName(fontName);
    if (fontUrl) {
      const newFontLink = loadFont(fontUrl);
      setFontLink(newFontLink);
    }
  };

  return { handleLoadCustomFont };
};

export default useFontLoader;
