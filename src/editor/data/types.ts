import {
    isArray,
    isNumber,
    isObject,
    isString
    } from "../tool/guards"

export interface Point {
    x: number
    y: number
}

export interface PolygonItem {
    id: number
    name: string
    points: Point[]
}

export interface StorageInterface {
    getItem(key: string): string | null
    setItem(key: string, value: string): void
}

export function isPolygonItemArray(data: unknown): data is PolygonItem[] {
    if (!isArray(data)) return false
    for (const item of data) {
        if (!isPolygonItem(item)) return false
    }
    return true
}

export function isPolygonItem(data: unknown): data is PolygonItem {
    if (!isObject(data)) return false
    if (!isNumber(data.id)) return false
    if (!isString(data.name)) return false
    if (!isArray(data.points)) return false
    for (const point of data.points) {
        if (!isPoint(point)) return false
    }
    return true
}

export function isPoint(data: unknown): data is Point {
    if (!isObject(data)) return false
    if (!isNumber(data.x)) return false
    if (!isNumber(data.y)) return false
    return true
}
