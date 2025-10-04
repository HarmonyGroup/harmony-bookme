import { useEffect, useRef } from 'react';

export const usePreventZoomAggressive = () => {
  const originalViewport = useRef<string>('');
  const isIOS = useRef<boolean>(false);

  useEffect(() => {
    // Check if we're on iOS
    isIOS.current = /iPad|iPhone|iPod/.test(navigator.userAgent);
    
    if (!isIOS.current) return;

    // Store original viewport
    const viewport = document.querySelector('meta[name="viewport"]') as HTMLMetaElement;
    if (viewport) {
      originalViewport.current = viewport.content;
    }

    // Function to prevent zoom
    const preventZoom = () => {
      if (viewport) {
        viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
      }
    };

    // Function to restore viewport
    const restoreViewport = () => {
      if (viewport && originalViewport.current) {
        viewport.content = originalViewport.current;
      }
    };

    // Apply immediately
    preventZoom();

    // Add event listeners to all inputs and textareas
    const inputs = document.querySelectorAll('input, textarea, select');
    
    const handleFocus = () => {
      preventZoom();
      // Also set font-size to 16px as backup
      inputs.forEach(input => {
        if (input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement || input instanceof HTMLSelectElement) {
          input.style.fontSize = '16px';
        }
      });
    };

    const handleBlur = () => {
      // Small delay to ensure zoom doesn't happen
      setTimeout(() => {
        restoreViewport();
        // Reset font sizes
        inputs.forEach(input => {
          if (input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement || input instanceof HTMLSelectElement) {
            input.style.fontSize = '';
          }
        });
      }, 100);
    };

    // Add listeners to all inputs
    inputs.forEach(input => {
      input.addEventListener('focus', handleFocus);
      input.addEventListener('blur', handleBlur);
    });

    // Cleanup
    return () => {
      inputs.forEach(input => {
        input.removeEventListener('focus', handleFocus);
        input.removeEventListener('blur', handleBlur);
      });
      restoreViewport();
    };
  }, []);

  // Re-run when component mounts/updates to catch dynamically added inputs
  useEffect(() => {
    if (!isIOS.current) return;

    const observer = new MutationObserver(() => {
      const inputs = document.querySelectorAll('input, textarea, select');
      inputs.forEach(input => {
        if (!input.hasAttribute('data-zoom-prevented')) {
          input.setAttribute('data-zoom-prevented', 'true');
          
          const handleFocus = () => {
            const viewport = document.querySelector('meta[name="viewport"]') as HTMLMetaElement;
            if (viewport) {
              viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
            }
            if (input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement || input instanceof HTMLSelectElement) {
              input.style.fontSize = '16px';
            }
          };

          const handleBlur = () => {
            setTimeout(() => {
              const viewport = document.querySelector('meta[name="viewport"]') as HTMLMetaElement;
              if (viewport && originalViewport.current) {
                viewport.content = originalViewport.current;
              }
              if (input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement || input instanceof HTMLSelectElement) {
                input.style.fontSize = '';
              }
            }, 100);
          };

          input.addEventListener('focus', handleFocus);
          input.addEventListener('blur', handleBlur);
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => observer.disconnect();
  }, []);
};
