import { useEffect, useRef } from 'react';

/**
 * Attach this ref to a <textarea> to make it auto-grow as the user types or presses Enter.
 * Usage:
 *   const ref = useAutoResize(value);
 *   <textarea ref={ref} value={value} ... />
 */
const useAutoResize = (value) => {
    const ref = useRef(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        // Reset height so shrinking also works
        el.style.height = 'auto';
        el.style.height = `${el.scrollHeight}px`;
    }, [value]);

    return ref;
};

export default useAutoResize;
