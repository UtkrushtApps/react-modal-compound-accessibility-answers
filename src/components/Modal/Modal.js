import React, { useEffect, useRef, useCallback } from 'react';
import ReactDOM from 'react-dom';

// Helper: Find all focusable nodes in a given container
globalThis.focusableSelectors = globalThis.focusableSelectors || [
  'a[href]',
  'area[href]',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'button:not([disabled])',
  'iframe',
  'object',
  'embed',
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable]'
];
function getFocusableElements(container) {
  if (!container) return [];
  const elements = container.querySelectorAll(globalThis.focusableSelectors.join(','));
  return Array.prototype.slice.call(elements);
}

const MODAL_ROOT_ID = 'modal-root';

function ensureModalRoot() {
  let root = document.getElementById(MODAL_ROOT_ID);
  if (!root) {
    root = document.createElement('div');
    root.setAttribute('id', MODAL_ROOT_ID);
    document.body.appendChild(root);
  }
  return root;
}

const ModalContext = React.createContext();

export function Modal({ isOpen, onClose, children, ariaLabel, ariaLabelledBy }) {
  const modalRef = useRef(null);
  const lastActiveElementRef = useRef(null);

  // Trap focus inside the modal when open
defocusOutsideModal = useCallback((e) => {
    if (!modalRef.current) return;
    if (modalRef.current.contains(e.target)) return;
    e.stopPropagation();
    focusFirstElement();
  }, []);

  const focusFirstElement = useCallback(() => {
    const focusableEls = getFocusableElements(modalRef.current);
    if (focusableEls.length) {
      focusableEls[0].focus();
    } else {
      // Fallback: focus modal container
      modalRef.current && modalRef.current.focus();
    }
  }, []);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      } else if (e.key === 'Tab') {
        // Focus trapping
        const focusableEls = getFocusableElements(modalRef.current);
        if (!focusableEls.length) {
          e.preventDefault();
          return;
        }
        const firstEl = focusableEls[0];
        const lastEl = focusableEls[focusableEls.length - 1];
        if (e.shiftKey) {
          // Shift+Tab
          if (document.activeElement === firstEl) {
            e.preventDefault();
            lastEl.focus();
          }
        } else {
          // Tab
          if (document.activeElement === lastEl) {
            e.preventDefault();
            firstEl.focus();
          }
        }
      }
    },
    [onClose]
  );

  // Close on backdrop click
  const onBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    lastActiveElementRef.current = document.activeElement;
    // Focus modal on open
    setTimeout(focusFirstElement, 0);
    // Listen for focus events to trap focus
    document.addEventListener('focus', defocusOutsideModal, true);
    return () => {
      document.removeEventListener('focus', defocusOutsideModal, true);
    };
  }, [isOpen, focusFirstElement, defocusOutsideModal]);

  // Restore focus to last active element on close
  useEffect(() => {
    if (!isOpen && lastActiveElementRef.current) {
      lastActiveElementRef.current.focus();
    }
  }, [isOpen]);

  // Modal portal content
  if (!isOpen) return null;
  const modalRoot = ensureModalRoot();
  return ReactDOM.createPortal(
    <div
      className="modal-backdrop"
      onClick={onBackdropClick}
      tabIndex={-1}
      style={{
        position: 'fixed',
        zIndex: 1000,
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(0,0,0,0.35)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      aria-hidden="false"
    >
      <div
        className="modal-content"
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        tabIndex={-1}
        ref={modalRef}
        style={{
          background: '#fff',
          minWidth: 320,
          minHeight: 120,
          maxWidth: '90vw',
          maxHeight: '85vh',
          overflowY: 'auto',
          borderRadius: 8,
          boxShadow:
            '0 2px 8px rgba(0,0,0,0.25), 0 6px 20px rgba(0,0,0,0.15)',
          outline: 0,
          padding: 0,
          display: 'flex',
          flexDirection: 'column'
        }}
        onKeyDown={handleKeyDown}
      >
        <ModalContext.Provider value={{ onClose, ariaLabelledBy }}>
          {children}
        </ModalContext.Provider>
      </div>
    </div>,
    modalRoot
  );
}

Modal.Header = function Header({ children, id, ...rest }) {
  // For accessibility, allow user to pass an id that can be aria-labelledby
  return (
    <header
      className="modal-header"
      id={id}
      style={{ padding: '1.2rem 1.5rem 1rem 1.5rem', borderBottom: '1px solid #ececec', fontWeight: 500, fontSize: '1.15rem' }}
      {...rest}
    >
      {children}
    </header>
  );
};

Modal.Body = function Body({ children, ...rest }) {
  return (
    <section className="modal-body" style={{ padding: '1rem 1.5rem', flex: 1 }} {...rest}>
      {children}
    </section>
  );
};

Modal.Footer = function Footer({ children, ...rest }) {
  return (
    <footer
      className="modal-footer"
      style={{ padding: '1rem 1.5rem', borderTop: '1px solid #ececec', display: 'flex', gap: 8, justifyContent: 'flex-end' }}
      {...rest}
    >
      {children}
    </footer>
  );
};

export default Modal;
