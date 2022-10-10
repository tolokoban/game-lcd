import Polygon from "@/editor/app/painter/polygon"
import { Point } from "@/editor/data/types"
import { sameSign, subtractPoints, vectorProduct } from "../../tool/calc"

export default class SubPolygon {
    constructor(private readonly polygon: Polygon, public elements: number[]) {}

    get length() {
        return this.elements.length
    }

    getPoint(element: number): Point {
        const index = this.getElementIndex(element)
        return this.polygon.getPoint(index)
    }

    removePoint(index: number): SubPolygon {
        const subElements = this.elements.filter((_elem, idx) => idx !== index)
        return new SubPolygon(this.polygon, subElements)
    }

    computeConvexity(elemA: number, elemO: number, elemB: number): number {
        const idxA = this.getElementIndex(elemA)
        const idxO = this.getElementIndex(elemO)
        const idxB = this.getElementIndex(elemB)
        return this.polygon.computeConvexity(idxA, idxO, idxB)
    }

    isEmptyTriangle(elemA: number, elemO: number, elemB: number): boolean {
        const A = this.getPoint(elemA)
        const O = this.getPoint(elemO)
        const B = this.getPoint(elemB)
        const OA = subtractPoints(A, O)
        const AB = subtractPoints(B, A)
        const BO = subtractPoints(O, B)
        for (const M of this.polygon.points) {
            const OM = subtractPoints(M, O)
            const convO = vectorProduct(OA, OM)
            const AM = subtractPoints(M, A)
            const convA = vectorProduct(AB, AM)
            if (!sameSign(convO, convA)) continue
            const BM = subtractPoints(M, B)
            const convB = vectorProduct(BO, BM)
            if (sameSign(convB, convO)) return false
        }
        return true
    }

    getElementIndex(element: number): number {
        const len = this.elements.length
        if (element < 0) element += len * Math.ceil(-element / len)
        return this.elements[element % len]
    }
}
