import { useEffect, useState } from 'react';

export const usePreventZoom = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Ensure we're on the client side to prevent hydration issues
    setIsClient(true);
  }, []);

  useEffect(() => {
    // Don't run until client-side hydration is complete
    if (!isClient) return;

    // Only apply on mobile devices
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (!isMobile) return;

    // Simple approach: just set the viewport once and leave it
    // This prevents zoom without interfering with input events
    const viewport = document.querySelector('meta[name="viewport"]') as HTMLMetaElement;
    if (viewport && !viewport.content.includes('user-scalable=no')) {
      const originalViewport = viewport.content;
      viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
      
      // Restore on unmount
      return () => {
        if (viewport) {
          viewport.content = originalViewport;
        }
      };
    }
  }, [isClient]);
};
