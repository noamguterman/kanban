import { useEffect, useRef } from 'react';

function useFocusTrap(ref, isActive = true, onEscape = null, focusFirstInput = true) {
  const previousFocus = useRef(null);
  const hasAutoFocused = useRef(false);
  const onEscapeRef = useRef(onEscape);
  onEscapeRef.current = onEscape;

  useEffect(() => {
    if (!isActive || !ref.current) return;

    // Store the element that was focused before the modal opened.
    previousFocus.current = document.activeElement;

    const focusableElements = ref.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    // Ensure modal container is focusable if we're not auto-focusing an inner element.
    if (!focusFirstInput && ref.current.tabIndex === undefined) {
      ref.current.tabIndex = -1;
    }

    // Run auto‑focus logic only once on mount.
    if (!hasAutoFocused.current) {
      setTimeout(() => {
        if (!ref.current.contains(document.activeElement)) {
          if (focusFirstInput && focusableElements.length > 0) {
            focusableElements[0].focus();
          } else {
            ref.current.focus();
          }
        }
        hasAutoFocused.current = true;
      }, 50);
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && onEscapeRef.current) {
        onEscapeRef.current();
        return;
      }
      if (e.key === 'Tab') {
        if (focusableElements.length === 0) {
          e.preventDefault();
          return;
        }
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && (document.activeElement === firstElement || document.activeElement === ref.current)) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    // The cleanup runs only when the modal is unmounted.
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      // Return focus to the element that had it before the modal opened.
      if (previousFocus.current) {
        previousFocus.current.focus();
      }
    };
  }, []); // empty dependency array so the effect only runs once on mount.
}

export default useFocusTrap;
