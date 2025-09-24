import { useCallback, useState } from 'react';

/**
 * Custom hook to manage open/close state of a modal.
 * Returns { isOpen, open, close, toggle }
 */
export default function useModal(initialOpen = false) {
  const [isOpen, setIsOpen] = useState(initialOpen);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((open) => !open), []);

  return { isOpen, open, close, toggle };
}
