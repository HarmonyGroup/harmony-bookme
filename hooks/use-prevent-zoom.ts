import { useEffect } from 'react';

export const usePreventZoom = () => {
  useEffect(() => {
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
        setTimeout(preventZoom, 50);
      }
    };

    const handleBlur = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
        // Add a small delay to ensure smooth transition
        setTimeout(restoreViewport, 150);
      }
    };

    document.addEventListener('focusin', handleFocus);
    document.addEventListener('focusout', handleBlur);

    return () => {
      document.removeEventListener('focusin', handleFocus);
      document.removeEventListener('focusout', handleBlur);
      restoreViewport();
    };
  }, []);
};
