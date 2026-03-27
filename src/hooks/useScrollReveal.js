import { useEffect, useRef } from 'react';

/**
 * useScrollReveal - attaches an IntersectionObserver to all `.reveal` elements
 * and adds `reveal-visible` when they scroll into view.
 *
 * Fixed issues:
 * 1. Re-runs whenever `deps` change (e.g. isEditing toggle, data changes) so
 *    newly rendered sections are always observed.
 * 2. Elements already in view on mount are revealed immediately.
 * 3. Cleans up the old observer before creating a new one.
 */
const useScrollReveal = (
    selector = '.reveal',
    visibleClass = 'reveal-visible',
    options = { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    deps = []
) => {
    const observerRef = useRef(null);

    useEffect(() => {
        // Disconnect any previous observer
        if (observerRef.current) {
            observerRef.current.disconnect();
        }

        // Small delay so React finishes rendering the DOM before we query
        const timer = setTimeout(() => {
            const elements = document.querySelectorAll(selector);

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add(visibleClass);
                        observer.unobserve(entry.target); // animate once
                    }
                });
            }, options);

            elements.forEach(el => {
                // If already fully visible in viewport, reveal immediately
                const rect = el.getBoundingClientRect();
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    el.classList.add(visibleClass);
                } else {
                    observer.observe(el);
                }
            });

            observerRef.current = observer;
        }, 50); // 50ms is enough for a React paint cycle

        return () => {
            clearTimeout(timer);
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);
};

export default useScrollReveal;
