import GenericEvent from "../../tool/generic-event"
import SubPolygon from "./sub-polygon"
import { Point, PolygonItem } from "@/data/types"
import { Triangle } from "../../tool/triangulate"
import {
    distance,
    sameSign,
    scalarProduct,
    subtractPoints,
    vectorProduct,
} from "../../tool/calc"

export default class Polygon {
    public readonly eventChange: GenericEvent<void>
    private _points: Point[]

    constructor(points: Point[] = []) {
        this.eventChange = new GenericEvent()
        this._points = points
    }

    reset(points: Point[]) {
        this._points = points.map((p) => ({ ...p }))
    }

    get points() {
        return this._points
    }

    get length() {
        return this._points.length
    }

    /**
     * If the polygon has no point at all, this method will throw an Exception.
     * Otherwise, it will return a point whatever index you provide, even
     * negative ones.
     */
    getPoint(index: number): Point {
        const len = this.length
        if (len === 0) throw Error("Polygon is empty!")

        if (index < 0) index += len * Math.ceil(-index / len)
        return this._points[index % len]
    }

    /**
     * If the polygon has no point at all, this method will throw an Exception.
     * Otherwise, it will return the coordinates of a vector between two points.
     */
    getVector(indexA: number, indexB: number): Point {
        const a = this.getPoint(indexA)
        const b = this.getPoint(indexB)
        return subtractPoints(b, a)
    }

    /**
     * @returns Index where the point has been inserted.
     */
    add(point: Point, index = -1): number {
        try {
            if (index < 0 || index > this._points.length)
                this._points.push(point)
            else this._points.splice(index, 0, point)
        } finally {
            this.fireChange()
            return index > -1 ? index : this.points.length - 1
        }
    }

    remove(index: number) {
        this._points.splice(index, 1)
        this.fireChange()
    }

    /**
     * @returns Index of the point near to `point`, -1 if not found.
     */
    findPoint(point: Point): number {
        const index = this._points.findIndex((p) => {
            const dX = point.x - p.x
            const dY = point.y - p.y
            const d2 = dX * dX + dY * dY
            console.log(p, d2)
            return d2 < 10 * 10
        })
        return index
    }

    /**
     * @return Distance between `point` and the edge between points at `indexA`
     * and `indexB`.
     */
    distFromEdge(point: Point, indexA: number, indexB: number): number {
        const A = this.getPoint(indexA)
        const B = this.getPoint(indexB)
        const M = point
        const AB = subtractPoints(B, A)
        const AB2 = scalarProduct(AB, AB)
        if (AB2 < 1e-9) return distance(M, A)

        const AM = subtractPoints(M, A)
        const AM2 = scalarProduct(AM, AM)
        const h = scalarProduct(AM, AB)
        return Math.sqrt(AM2 - (h * h) / AB2)
    }

    get elements() {
        const elements: number[] = Array(this.length)
        for (let index = 0; index < this.length; index++) {
            elements[index] = index
        }
        return elements
    }

    /**
     * @returns 0 for a flat triangle.
     * Otherwise the sign gives the convexity in O.
     */
    computeConvexity(idxA: number, idxO: number, idxB: number): number {
        const A = this.getPoint(idxA)
        const O = this.getPoint(idxO)
        const B = this.getPoint(idxB)
        return vectorProduct(subtractPoints(A, O), subtractPoints(B, O))
    }

    triangulate(): Array<[a: number, b: number, c: number]> {
        let subPoly = new SubPolygon(this, this.elements)
        const triangles: Array<[number, number, number]> = []
        for (let loop = 0; loop < this.length; loop++) {
            if (subPoly.length < 4) break
            subPoly = removeOneEar(subPoly, triangles)
            console.log("🚀 [polygon] subPoly = ", subPoly.length) // @FIXME: Remove this line written on 2022-10-07 at 15:04
        }
        if (subPoly.length === 3) {
            triangles.push([
                subPoly.getElementIndex(0),
                subPoly.getElementIndex(1),
                subPoly.getElementIndex(2),
            ])
        }
        console.log(JSON.stringify(triangles))
        return triangles
    }

    fireChange() {
        this.eventChange.fire()
    }
}

function removeOneEar(poly: SubPolygon, triangles: Triangle[]): SubPolygon {
    const convexIndexes = findConvexIndexes(poly)
    for (let index = 0; index < poly.length; index++) {
        if (!convexIndexes.has(index)) continue

        if (poly.isEmptyTriangle(index - 1, index, index + 1)) {
            triangles.push([
                poly.getElementIndex(index - 1),
                poly.getElementIndex(index),
                poly.getElementIndex(index + 1),
            ])
            return poly.removePoint(index)
        }
    }
    throw Error("We are not supposed to get here!")
}

function findConvexIndexes(poly: SubPolygon): Set<number> {
    let bestElementIndex = 0
    let bestElementY = Number.MAX_SAFE_INTEGER
    for (let index = 0; index < poly.length; index++) {
        const { y } = poly.getPoint(index)
        if (y < bestElementY) {
            bestElementY = y
            bestElementIndex = index
        }
    }
    const idxO = bestElementIndex
    const idxA = idxO - 1
    const idxB = idxO + 1
    const convexity = poly.computeConvexity(idxA, idxO, idxB)
    const set = new Set<number>()
    for (let index = 0; index < poly.length; index++) {
        const current = poly.computeConvexity(index - 1, index, index + 1)
        if (sameSign(current, convexity)) set.add(index)
    }
    return set
}
