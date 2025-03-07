import { useEffect, useRef } from 'react'

/**
 * Custom hook to trap focus within a modal
 * @param {Object} ref - React ref to the modal container element
 * @param {boolean} isActive - Whether the modal is active
 * @param {Function} onEscape - Function to call when Escape is pressed
 */
function useFocusTrap(ref, isActive = true, onEscape = null, focusFirstInput = true) {
  const previousFocus = useRef(null);

  useEffect(() => {
    if (!isActive || !ref.current) return;
    
    // Store the element that had focus before modal opened
    previousFocus.current = document.activeElement;
    
    // Find all focusable elements
    const focusableElements = ref.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    // Ensure modal container is focusable if we're not focusing inputs
    if (!focusFirstInput && ref.current.tabIndex === undefined) {
      ref.current.tabIndex = -1;
    }
    
    // Focus modal container or first element
    setTimeout(() => {
      if (focusFirstInput && focusableElements.length > 0) {
        focusableElements[0].focus();
      } else {
        // Focus the modal container itself
        ref.current.focus();
      }
    }, 50);
    
    // Keyboard navigation handler
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && onEscape) {
        onEscape();
        return;
      }
      
      if (e.key === 'Tab') {
        // If no focusable elements, prevent tab navigation
        if (focusableElements.length === 0) {
          e.preventDefault();
          return;
        }
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        // Shift+Tab on first element -> go to last element
        if (e.shiftKey && (document.activeElement === firstElement || document.activeElement === ref.current)) {
          e.preventDefault();
          lastElement.focus();
        } 
        // Tab on last element -> go to first element
        else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      // Return focus to previous element when modal closes
      if (previousFocus.current) {
        previousFocus.current.focus();
      }
    };
  }, [isActive, onEscape, ref, focusFirstInput]);
}

export default useFocusTrap