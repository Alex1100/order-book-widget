import { useEffect, useState } from 'react';

export const useMobileOrientation = () => {
  const [deviceState, setDeviceState] = useState({ isMobile: false, orientation: 'portrait' });

  useEffect(() => {
    const updateDeviceState = () => {
      const mobileWidth = 768; // Arbitrary breakpoint
      const isCurrentlyMobile = window.innerWidth < mobileWidth;
      const currentOrientation = window.matchMedia('(orientation: portrait)').matches
        ? 'portrait'
        : 'landscape';

      setDeviceState({ isMobile: isCurrentlyMobile, orientation: currentOrientation });
    };

    updateDeviceState();
    window.addEventListener('resize', updateDeviceState);
    return () => window.removeEventListener('resize', updateDeviceState);
  }, []);

  return deviceState;
};
