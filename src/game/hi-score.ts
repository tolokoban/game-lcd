const KEY = "hi-score"

export function getHiScore(): number {
    const score = parseInt(localStorage.getItem(KEY) ?? "0")
    if (isNaN(score)) return 27
    return score
}

/**
 * @returns `true` if `value` if greater than the current hi-score.
 */
export function setHiScore(value: number): boolean {
    const currentHiScore = getHiScore()
    if (value > currentHiScore) {
        localStorage.setItem(KEY, `${value}`)
        return true
    }
    return false
}
