import { useEffect, useState } from 'react';

const MIN_WIDTH_WINDOW = 768;

const useMobileDetect = () => {
  const [isMobile, setIsMobile] = useState(false);

  const handleResize = () => {
    setIsMobile(window.innerWidth < MIN_WIDTH_WINDOW);
  };

  useEffect(() => {
    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile;
};

export default useMobileDetect;
