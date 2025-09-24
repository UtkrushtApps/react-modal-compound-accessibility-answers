# Solution Steps

1. Create a custom hook (useModal) to manage open/close state for the modal, returning helpers (isOpen, open, close, toggle).

2. Implement the Modal component that uses React Portal to render above the app and places modal content in a dedicated DOM node.

3. In Modal, trap focus when open: on mount, focus the first focusable element, and prevent focus from escaping the modal (focus trap). Restore focus to the previously active element on close.

4. Handle keyboard navigation: support closing on Escape and cycle focus with Tab/Shift+Tab keys. Make sure aria-modal, aria-label/aria-labelledby, and dialog role are set.

5. Close the modal on backdrop (outside) click by comparing event targets.

6. Implement the Modal compound subcomponents: Modal.Header, Modal.Body, Modal.Footer, passing aria-labelledby when needed. Provide ID passthrough for accessibility header.

7. Add ModalContext if needed to pass down onClose or aria-labelledby to subcomponents (future proofing).

8. Add and export the Modal and its subcomponents, and provide index.js for modular imports.

9. (Optional) Add a CSS file for visual presentation and soft animations.

10. Test by combining useModal with Modal in an app to demonstrate correct behavior.

