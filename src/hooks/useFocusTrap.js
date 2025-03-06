import { useEffect, useRef } from 'react'

/**
 * Custom hook to trap focus within a modal
 * @param {Object} ref - React ref to the modal container element
 * @param {boolean} isActive - Whether the modal is active
 * @param {Function} onEscape - Function to call when Escape is pressed
 */
function useFocusTrap(ref, isActive = true, onEscape = null) {
  const previousFocus = useRef(null)

  useEffect(() => {
    if (!isActive || !ref.current) return
    
    // Store the element that had focus before modal opened
    previousFocus.current = document.activeElement
    
    // Find all focusable elements
    const focusableElements = ref.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    
    if (focusableElements.length === 0) return
    
    // Focus the first element
    setTimeout(() => focusableElements[0].focus(), 50)
    
    // Handle keyboard navigation
    const handleKeyDown = (e) => {
      // Handle Tab key
      if (e.key === 'Tab') {
        // If at least one focusable element exists
        if (focusableElements.length > 0) {
          const firstElement = focusableElements[0]
          const lastElement = focusableElements[focusableElements.length - 1]
          
          // Shift+Tab on first element -> go to last element
          if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault()
            lastElement.focus()
          }
          // Tab on last element -> go to first element  
          else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault()
            firstElement.focus()
          }
        }
      }
      
      // Handle Escape key
      if (e.key === 'Escape' && onEscape) {
        onEscape()
      }
    }
    
    document.addEventListener('keydown', handleKeyDown);
    
    // Clean up
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      // Return focus to previous element when modal closes
      if (previousFocus.current) {
        previousFocus.current.focus()
      }
    }
  }, [isActive, onEscape, ref])
}

export default useFocusTrap