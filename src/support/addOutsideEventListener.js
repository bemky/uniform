export default function addOutsideEventListener(el, callback) {
    const listener = e => {
        const rect = el.getBoundingClientRect()
        if (e.clientY < rect.top || e.clientY > rect.top + rect.height || e.clientX < rect.left || e.clientX > rect.left + rect.width) {
            callback(e)
        }
    }
    document.addEventListener('click', listener)
    
    return () => document.removeEventListener('click', listener);
}