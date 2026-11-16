import { useEffect, useRef } from 'react';

const FOCUSABLE =
    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

// Comportamiento accesible de ventanas modales: foco inicial, Tab atrapado, Escape y foco de regreso.
export function useDialog(isOpen, onClose, containerRef) {
    const onCloseRef = useRef(onClose);

    useEffect(() => {
        onCloseRef.current = onClose;
    }, [onClose]);

    useEffect(() => {
        if (!isOpen) {
            return undefined;
        }

        const previouslyFocused = document.activeElement;
        const container = containerRef.current;
        const getFocusable = () => Array.from(container.querySelectorAll(FOCUSABLE));

        (getFocusable()[0] ?? container).focus();
        document.body.classList.add('no-scroll');

        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                onCloseRef.current();
                return;
            }
            if (event.key !== 'Tab') {
                return;
            }

            const focusable = getFocusable();
            if (focusable.length === 0) {
                event.preventDefault();
                return;
            }

            const first = focusable[0];
            const last = focusable[focusable.length - 1];

            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.classList.remove('no-scroll');
            previouslyFocused?.focus?.();
        };
    }, [isOpen, containerRef]);
}
