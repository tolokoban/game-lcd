export type PathDefinition = Array<number | number[]>
export type PathsDefinition = { [key: string]: PathDefinition }

export default class Sprites<T extends PathsDefinition> {
    private readonly sprites = new Set<number>()

    constructor(private readonly paths: T) {}

    clear(...names: Array<keyof T>) {
        const { paths, sprites } = this
        if (names.length === 0) {
            names = Object.keys(names)
        }
        for (const path of names.map((name) => paths[name])) {
            for (const step of path) {
                forEach(step, (sprite) => sprites.delete(sprite))
            }
        }
    }

    isOn(name: keyof T, step: number = 0) {
        const { paths, sprites } = this
        const items = this.getPathStep(name, step)
        for (const item of items) {
            if (!sprites.has(item)) return false
        }
        return true
    }

    isOff(name: keyof T, step: number = 0) {
        return !this.isOn(name, step)
    }

    /**
     * @returns An array of all the activated sprites.
     */
    list(): number[] {
        return Array.from(this.sprites)
    }

    on(name: string, ...steps: number[]) {
        const { paths, sprites } = this
        const path = paths[name]
        if (steps.length === 0) steps = path.map((_item, index) => index)

        for (const step of steps) {
            const items = this.getPathStep(name, step)
            for (const item of items) {
                sprites.add(item)
            }
        }
    }

    off(name: string, ...steps: number[]) {
        const { paths, sprites } = this
        const path = paths[name]
        if (steps.length === 0) steps = path.map((_item, index) => index)

        for (const step of steps) {
            const items = this.getPathStep(name, step)
            for (const item of items) {
                sprites.delete(item)
            }
        }
    }

    private getPathStep(name: keyof T, step: number): number[] {
        const { paths } = this
        const path = paths[name]
        if (step < 0 || step >= path.length) {
            throw Error(
                `Step ${step} is out of bounds for path "${name as string}"!`
            )
        }
        const value = path[step]
        return Array.isArray(value) ? value : [value]
    }
}

function forEach(value: number | number[], callback: (item: number) => void) {
    if (Array.isArray(value)) {
        for (const item of value) callback(item)
    } else {
        callback(value)
    }
}
