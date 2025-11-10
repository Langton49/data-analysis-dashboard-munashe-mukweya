import { useEffect, useRef, useCallback, useState } from 'react';
import { announceToScreenReader, generateAriaId } from '@/utils/accessibility';

export function useFocusManagement(autoFocus: boolean = false) {
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (autoFocus && elementRef.current) {
      elementRef.current.focus();
    }
  }, [autoFocus]);

  const focusElement = useCallback(() => {
    elementRef.current?.focus();
  }, []);

  return { elementRef, focusElement };
}


export function useKeyboardNavigation(
  onEnter?: () => void,
  onEscape?: () => void,
  onArrowUp?: () => void,
  onArrowDown?: () => void
) {
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      switch (event.key) {
        case 'Enter':
          event.preventDefault();
          onEnter?.();
          break;
        case 'Escape':
          event.preventDefault();
          onEscape?.();
          break;
        case 'ArrowUp':
          event.preventDefault();
          onArrowUp?.();
          break;
        case 'ArrowDown':
          event.preventDefault();
          onArrowDown?.();
          break;
      }
    },
    [onEnter, onEscape, onArrowUp, onArrowDown]
  );

  return { handleKeyDown };
}


export function useScreenReaderAnnouncement() {
  const announce = useCallback((message: string, delay: number = 0) => {
    setTimeout(() => {
      announceToScreenReader(message);
    }, delay);
  }, []);

  return { announce };
}


export function useAriaId(prefix: string = 'component'): string {
  const [id] = useState(() => generateAriaId(prefix));
  return id;
}


export function useAriaExpanded(initialState: boolean = false) {
  const [isExpanded, setIsExpanded] = useState(initialState);

  const toggle = useCallback(() => {
    setIsExpanded(prev => !prev);
  }, []);

  const expand = useCallback(() => {
    setIsExpanded(true);
  }, []);

  const collapse = useCallback(() => {
    setIsExpanded(false);
  }, []);

  return {
    isExpanded,
    'aria-expanded': isExpanded,
    toggle,
    expand,
    collapse,
  };
}


export function useFocusTrap(isActive: boolean = false) {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    firstElement?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement?.focus();
        }
      }
    };

    container.addEventListener('keydown', handleKeyDown);

    return () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  }, [isActive]);

  return { containerRef };
}

export function useRovingTabIndex(itemCount: number) {
  const [activeIndex, setActiveIndex] = useState(0);

  const getTabIndex = useCallback(
    (index: number) => (index === activeIndex ? 0 : -1),
    [activeIndex]
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent, index: number) => {
      let newIndex = index;

      switch (event.key) {
        case 'ArrowDown':
        case 'ArrowRight':
          event.preventDefault();
          newIndex = Math.min(index + 1, itemCount - 1);
          break;
        case 'ArrowUp':
        case 'ArrowLeft':
          event.preventDefault();
          newIndex = Math.max(index - 1, 0);
          break;
        case 'Home':
          event.preventDefault();
          newIndex = 0;
          break;
        case 'End':
          event.preventDefault();
          newIndex = itemCount - 1;
          break;
        default:
          return;
      }

      if (newIndex !== index) {
        setActiveIndex(newIndex);
      }
    },
    [itemCount]
  );

  return {
    activeIndex,
    setActiveIndex,
    getTabIndex,
    handleKeyDown,
  };
}

export function useSkipLink() {
  const skipToContent = useCallback(() => {
    const main = document.querySelector('main');
    if (main) {
      main.setAttribute('tabindex', '-1');
      main.focus();
      main.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return { skipToContent };
}


export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
}
