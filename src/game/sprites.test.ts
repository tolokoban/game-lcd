import Sprites, { PathsDefinition } from "./sprites"

describe("game/sprites.ts", () => {
    describe("Sprites.on()", () => {
        const pathsDef: PathsDefinition = {
            rick: [1, 2, 3, 4],
            trap: [5, [6, 7], 8],
        }
        const cases: Array<
            [name: string, steps: number[], expected: number[]]
        > = [
            ["rick", [0], [1]],
            ["rick", [0, 2], [1, 3]],
            ["rick", [], [1, 2, 3, 4]],
            ["trap", [1], [6, 7]],
            ["trap", [], [5, 6, 7, 8]],
        ]
        for (const [name, steps, expected] of cases) {
            it(`on("${name}"${steps
                .map((s) => `, ${s}`)
                .join("")}) should activate ${JSON.stringify(
                expected
            )}`, () => {
                const sprites = new Sprites(pathsDef)
                sprites.on(name, ...steps)
                const got = sprites.list()
                expect(got).toEqual(expected)
            })
        }
    })
    describe("Sprites.isOn()", () => {
        const pathsDef: PathsDefinition = {
            rick: [1, 2, 3, 4],
            trap: [5, [6, 7], 8],
        }
        const cases: Array<
            [name: string, steps: number[], expected: number[]]
        > = [
            ["rick", [0], [1]],
            ["rick", [0, 2], [1, 3]],
            ["trap", [1], [6, 7]],
        ]
        for (const [name, steps, expected] of cases) {
            it(`isOn("${name}", ...) should return true for every item in ${JSON.stringify(
                expected
            )}`, () => {
                const sprites = new Sprites(pathsDef)
                sprites.on(name, ...steps)
                for (const step of steps) {
                    expect(sprites.isOn(name, step)).toBeTruthy()
                }
            })
        }
    })
    describe("Sprites.clear()", () => {
        const pathsDef: PathsDefinition = {
            rick: [1, 2, 3, 4],
            trap: [5, [6, 7], 8],
        }
        it(`should clear "rick"`, () => {
            const sprites = new Sprites(pathsDef)
            sprites.on("rick")
            sprites.on("trap")
            sprites.clear("rick")
            expect(sprites.list()).toEqual([5, 6, 7, 8])
        })
    })
})
