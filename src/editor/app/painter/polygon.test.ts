import Polygon from "./polygon"
import { Point } from "@/editor/data/types"

describe("app/painter/polygon.ts", () => {
    describe("Polygon.getPoint()", () => {
        const polygon = new Polygon([
            { x: 0, y: 0 },
            { x: 1, y: 1 },
            { x: 2, y: 2 },
            { x: 3, y: 3 },
        ])
        const cases: Array<[index: number, expected: Point]> = [
            [0, { x: 0, y: 0 }],
            [1, { x: 1, y: 1 }],
            [2, { x: 2, y: 2 }],
            [3, { x: 3, y: 3 }],
            [4, { x: 0, y: 0 }],
            [-1, { x: 3, y: 3 }],
            [-10, { x: 2, y: 2 }],
        ]
        for (const [index, expected] of cases) {
            it(`should get point ${index} from a polygon with ${polygon.length} points`, () => {
                const got = polygon.getPoint(index)
                expect(got).toEqual(expected)
            })
        }
    })
    describe("Polygon.distFromEdge()", () => {
        const polygon = new Polygon([
            { x: 0, y: 0 },
            { x: 10, y: 0 },
            { x: 5, y: 3 },
            { x: -3, y: 1 },
        ])
        const cases: Array<[index: number, point: Point, expected: number]> = [
            [0, { x: 12, y: 7 }, 7],
            // [0, { x: 12, y: -7 }, 7],
            // [0, { x: 2, y: 7 }, 7],
            // [0, { x: -42, y: 7 }, 7],
            // [0, { x: -42, y: -7 }, 7],
        ]
        for (const [index, point, expected] of cases) {
            const A = polygon.getPoint(index)
            const B = polygon.getPoint(index + 1)
            it(`should find the distance between (${point.x}, ${point.y}) and [(${A.x}, ${A.y}) - (${B.x}, ${B.y})] to be close to ${expected}`, () => {
                expect(
                    polygon.distFromEdge(point, index, index + 1)
                ).toBeCloseTo(expected, 6)
            })
        }
    })
})
