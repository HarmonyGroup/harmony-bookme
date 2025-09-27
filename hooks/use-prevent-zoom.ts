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

    let originalViewport: string | null = null;
    let isPreventingZoom = false;

    const preventZoom = () => {
      if (isPreventingZoom) return;
      
      const viewport = document.querySelector('meta[name="viewport"]') as HTMLMetaElement;
      if (viewport) {
        originalViewport = viewport.content;
        viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
        isPreventingZoom = true;
      }
    };

    const restoreViewport = () => {
      if (!isPreventingZoom) return;
      
      const viewport = document.querySelector('meta[name="viewport"]') as HTMLMetaElement;
      if (viewport && originalViewport) {
        viewport.content = originalViewport;
        isPreventingZoom = false;
      }
    };

    const handleFocus = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
        // Add a small delay to avoid interfering with dialog animations
        setTimeout(preventZoom, 100);
      }
    };

    const handleBlur = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
        // Add a small delay to ensure smooth transition
        setTimeout(restoreViewport, 200);
      }
    };

    // Use a slight delay to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      document.addEventListener('focusin', handleFocus);
      document.addEventListener('focusout', handleBlur);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('focusin', handleFocus);
      document.removeEventListener('focusout', handleBlur);
      restoreViewport();
    };
  }, [isClient]);
};
