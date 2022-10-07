import Data from "./data"
import { PolygonItem } from "./types"

describe("data/data.ts", () => {
    describe("Data.updatePolygon()", () => {
        const data = makeData()
        data.addPolygonToList()
        data.addPolygonToList()
        data.updatePolygon({ name: "foobar" })
        it("should update name of current polygon", () => {
            const items = data.getPolygonList()
            const got = items.map((p) => `${p.name}#${p.id}`).join(",")
            const exp = "Polygon_1#1,Polygon_2#2,foobar#3"
            expect(got).toEqual(exp)
        })
    })
    describe("Data.new", () => {
        const data = makeData()
        it("should have an initial Polygon", () => {
            const items = data.getPolygonList()
            const got = items.map((p) => `${p.name}#${p.id}`).join(",")
            const exp = "Polygon_1#1"
            expect(got).toEqual(exp)
        })
    })
    describe("Data.addPolygonToList()", () => {
        const cases: Array<[count: number, expected: string]> = [
            [1, "Polygon_1#1,Polygon_2#2"],
            [2, "Polygon_1#1,Polygon_2#2,Polygon_3#3"],
            [3, "Polygon_1#1,Polygon_2#2,Polygon_3#3,Polygon_4#4"],
        ]
        for (const [count, expected] of cases) {
            it(`should be able to add ${count} polygon(s)`, () => {
                const data = makeData()
                for (let i = 0; i < count; i++) data.addPolygonToList()
                const items = data.getPolygonList()
                const got = items.map((p) => `${p.name}#${p.id}`).join(",")
                expect(got).toEqual(expected)
            })
        }
    })
})

function makeData() {
    return new Data({
        getItem(key: string) {
            return "[]"
        },
        setItem(key: string, value: string) {},
    })
}
