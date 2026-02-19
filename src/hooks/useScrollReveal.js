import { useEffect } from 'react';

/**
 * useScrollReveal - attaches an IntersectionObserver to all elements
 * matching `selector` and adds the class `visibleClass` when they enter view.
 *
 * Usage: call inside your template component at the top level.
 *   useScrollReveal();
 */
const useScrollReveal = (
    selector = '.reveal',
    visibleClass = 'reveal-visible',
    options = { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
) => {
    useEffect(() => {
        const elements = document.querySelectorAll(selector);

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add(visibleClass);
                    observer.unobserve(entry.target); // animate once
                }
            });
        }, options);

        elements.forEach(el => observer.observe(el));

        return () => observer.disconnect();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps
};

export default useScrollReveal;
