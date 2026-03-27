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
    options = { threshold: 0.08, rootMargin: '0px 0px -60px 0px' },
    deps = []
) => {
    const observerRef = useRef(null);

    useEffect(() => {
        // Disconnect previous observer before creating a new one
        if (observerRef.current) {
            observerRef.current.disconnect();
            observerRef.current = null;
        }

        // Wait one paint cycle so React has flushed the DOM
        const timer = requestAnimationFrame(() => {
            const elements = document.querySelectorAll(selector);
            if (!elements.length) return;

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add(visibleClass);
                        observer.unobserve(entry.target);
                    }
                });
            }, options);

            elements.forEach(el => {
                // Already in viewport? Reveal immediately without re-animating
                const rect = el.getBoundingClientRect();
                const inView = rect.top < window.innerHeight - 20 && rect.bottom > 0;
                if (inView) {
                    el.classList.add(visibleClass);
                } else {
                    // Remove stale visible class so it can re-animate (e.g. after edit mode)
                    el.classList.remove(visibleClass);
                    observer.observe(el);
                }
            });

            observerRef.current = observer;
        });

        return () => {
            cancelAnimationFrame(timer);
            if (observerRef.current) {
                observerRef.current.disconnect();
                observerRef.current = null;
            }
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);
};

export default useScrollReveal;
