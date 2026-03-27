import { useEffect, useRef } from 'react';

/**
 * useScrollReveal
 *
 * Attaches an IntersectionObserver to all elements matching `selector`
 * and adds `visibleClass` the moment they scroll into view.
 *
 * Key behaviours:
 * - Triggers slightly BEFORE the element reaches the viewport edge
 *   (rootMargin: '-60px' bottom) so the animation completes as you arrive,
 *   not after you've already scrolled past.
 * - Re-runs whenever `deps` change (e.g. isEditing toggle) so newly
 *   mounted elements are always observed.
 * - Elements already in the viewport on mount are revealed immediately
 *   (no animation delay for above-the-fold content).
 * - Each element is unobserved after it animates (fire once).
 */
const useScrollReveal = (
    selector = '.reveal',
    visibleClass = 'reveal-visible',
    options = { threshold: 0, rootMargin: '0px' },
    deps = []
) => {
    const observerRef = useRef(null);

    useEffect(() => {
        // Disconnect previous observer
        if (observerRef.current) {
            observerRef.current.disconnect();
            observerRef.current = null;
        }

        // Use a slight timeout to ensure React has painted all DOM nodes and
        // CSS has applied initial styles (like opacity: 0).
        const timer = setTimeout(() => {
            const elements = document.querySelectorAll(selector);
            if (!elements.length) return;

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    // entry.isIntersecting is reliably computed by the browser
                    // even after images load and pushing things around.
                    if (entry.isIntersecting) {
                        entry.target.classList.add(visibleClass);
                        observer.unobserve(entry.target);
                    }
                });
            }, options);

            elements.forEach(el => {
                // By removing the class first, we ensure re-animation is possible when toggling edit mode.
                el.classList.remove(visibleClass);
                // ALWAYS observe. The observer will immediately fire for elements already in view.
                observer.observe(el);
            });

            observerRef.current = observer;
        }, 100);

        return () => {
            clearTimeout(timer);
            if (observerRef.current) {
                observerRef.current.disconnect();
                observerRef.current = null;
            }
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);
};

export default useScrollReveal;
