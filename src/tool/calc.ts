import { Point } from "../data/types"

export function subtractPoints(a: Point, b: Point): Point {
    return {
        x: a.x - b.x,
        y: a.y - b.y,
    }
}

export function addPoints(a: Point, b: Point): Point {
    return {
        x: b.x + a.x,
        y: b.y + a.y,
    }
}

export function scalePoint(a: Point, scale: number): Point {
    return {
        x: a.x * scale,
        y: a.y * scale,
    }
}

export function scalarProduct(a: Point, b: Point): number {
    return a.x * b.x + a.y * b.y
}

export function vectorProduct(a: Point, b: Point): number {
    return a.x * b.y - a.y * b.x
}

export function distance(a: Point, b: Point): number {
    const v = subtractPoints(b, a)
    return Math.sqrt(scalarProduct(v, v))
}

export function sameSign(a: number, b: number): boolean {
    return (a > 0 && b > 0) || (a < 0 && b < 0)
}
