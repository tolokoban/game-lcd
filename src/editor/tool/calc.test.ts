import { Point } from "@/editor/data/types"
import { scalarProduct } from "./calc"

describe("app/painter/point.ts", () => {
    describe("Point.scalarProduct()", () => {
        const cases: Array<[p1: Point, p2: Point, expected: number]> = [
            [{ x: 3, y: 0 }, { x: 0, y: 5 }, 0],
            [{ x: 3, y: 1 }, { x: -1, y: 8 }, 5],
        ]
        for (const [p1, p2, expected] of cases) {
            it(`expect (${p1.x}, ${p1.y}).(${p2.x}, ${p2.y}) to be close to ${expected}`, () => {
                expect(scalarProduct(p1, p2)).toBeCloseTo(expected, 6)
            })
        }
    })
})
