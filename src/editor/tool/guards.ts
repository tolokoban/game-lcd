export function isString(data: unknown): data is string {
    return typeof data === "string"
}

export function isNumber(data: unknown): data is number {
    return typeof data === "number"
}

export function isArray(data: unknown): data is unknown[] {
    return Array.isArray(data)
}

export function isObject(data: unknown): data is Record<string, unknown> {
    if (!data) return false
    if (Array.isArray(data)) return false
    return typeof data === "object"
}
