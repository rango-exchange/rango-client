import { useLayoutEffect, useState } from 'react';

/*
 * mobile: screen <= 480
 * tablet: screen > 480 and screen <= 768
 * notebook: screen > 768 & screen <= 1024
 * large: screen > 1024 & screen <= 1200
 * extra large: screen > 1200
 */

const MIN_TABLET_WIDTH = 480;
const MIN_NOTEBOOK_WIDTH = 768;
const MIN_LARGE_SCREEN_WIDTH = 1024;
const MIN_EXTRA_LARGE_SCREEN_WIDTH = 1200;

const useScreenDetect = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isNotebook, setIsNotebook] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const [isExtraLargeScreen, setIsExtraLargeScreen] = useState(false);

  const handleResize = () => {
    setIsMobile(window.innerWidth <= MIN_TABLET_WIDTH);
    setIsTablet(
      window.innerWidth > MIN_TABLET_WIDTH &&
        window.innerWidth <= MIN_NOTEBOOK_WIDTH
    );
    setIsNotebook(
      window.innerWidth > MIN_NOTEBOOK_WIDTH &&
        window.innerWidth <= MIN_LARGE_SCREEN_WIDTH
    );
    setIsLargeScreen(
      window.innerWidth > MIN_LARGE_SCREEN_WIDTH &&
        window.innerWidth <= MIN_EXTRA_LARGE_SCREEN_WIDTH
    );
    setIsExtraLargeScreen(window.innerWidth > MIN_EXTRA_LARGE_SCREEN_WIDTH);
  };

  useLayoutEffect(() => {
    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    isMobile,
    isTablet,
    isNotebook,
    isLargeScreen,
    isExtraLargeScreen,
  };
};

export default useScreenDetect;
