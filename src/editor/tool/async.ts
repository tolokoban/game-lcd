export function debounce<T, F extends (...args: never[]) => T>(
    action: F,
    delay: number
) {
    let timeoutId = 0
    return (...args: Parameters<F>): Promise<T> =>
        new Promise((resolve) => {
            window.clearTimeout(timeoutId)
            timeoutId = window.setTimeout(() => resolve(action(...args)), delay)
        })
}
