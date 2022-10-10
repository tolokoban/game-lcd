import GenericEvent from "../tool/generic-event"
import { debounce } from "../tool/async"
import { loadPolygonItems, savePolygonItems } from "./storage"
import { Point, PolygonItem, StorageInterface } from "./types"

const DEBOUNCE_SAVE_DELAY = 500

export default class Data {
    private static instance?: Data

    public static getSingleton(): Data {
        if (!Data.instance) Data.instance = new Data(window.localStorage)
        return Data.instance
    }

    public readonly eventPolygonListChange: GenericEvent<PolygonItem[]>
    public readonly eventCurrentPolygonChange: GenericEvent<number>

    private readonly polygonList: PolygonItem[]
    private _currentPolygonId: number

    constructor(private readonly storage: StorageInterface) {
        this.eventPolygonListChange = new GenericEvent()
        this.eventCurrentPolygonChange = new GenericEvent()
        this.polygonList = loadPolygonItems(storage)
        if (this.polygonList.length === 0) {
            throw Error("PolygonItem list must never be empty!")
        }
        this._currentPolygonId = this.polygonList[0].id
    }

    getPolygonList(): PolygonItem[] {
        return this.polygonList.map((p) => ({ ...p }))
    }

    firePolygonListChanged() {
        this.eventPolygonListChange.fire([...this.polygonList])
        this.save()
    }

    get currentPolygonId() {
        return this._currentPolygonId
    }
    set currentPolygonId(id: number) {
        for (const poly of this.polygonList) {
            if (poly.id !== id) continue

            this._currentPolygonId = id
            this.eventCurrentPolygonChange.fire(id)
            return
        }
    }

    updatePolygon({
        name,
        points,
    }: Partial<{ name: string; points: Point[] }>) {
        const poly = this.polygonList.find(
            (p) => p.id === this.currentPolygonId
        )
        if (!poly) return

        let updated = false
        if (points) {
            poly.points = points.map((p) => ({ ...p }))
            updated = true
        }
        if (name) {
            if (!this.findPolygonByName(name)) {
                poly.name = name
                updated = true
            }
        }
        if (!updated) return

        this.firePolygonListChanged()
        this.save()
    }

    moveCurrentDown() {
        const polygons = this.polygonList
        const index = polygons.findIndex((p) => p.id === this.currentPolygonId)
        if (index < 0) return

        const current = this.getCurrentPolygon()
        if (index === polygons.length - 1) {
            polygons.pop()
            polygons.unshift(current)
            this.firePolygonListChanged()
            return
        }

        polygons[index] = polygons[index + 1]
        polygons[index + 1] = current
        this.firePolygonListChanged()
    }

    moveCurrentUp() {
        const polygons = this.polygonList
        const index = polygons.findIndex((p) => p.id === this.currentPolygonId)
        if (index < 0) return

        const current = this.getCurrentPolygon()
        if (index === 0) {
            polygons.shift()
            polygons.push(current)
            this.firePolygonListChanged()
            return
        }

        polygons[index] = polygons[index - 1]
        polygons[index - 1] = current
        this.firePolygonListChanged()
    }

    duplicateCurrentPolygon(): PolygonItem {
        const current = this.getCurrentPolygon()
        const id = this.getFreeId()
        let name = this.makeNewPolygonName()
        const poly: PolygonItem = {
            id,
            name,
            points: current.points.map((p) => ({ ...p })),
        }
        this.polygonList.splice(
            this.getPolygonList().findIndex((p) => p.id === current.id) + 1,
            0,
            poly
        )
        this.currentPolygonId = id
        this.firePolygonListChanged()
        return poly
    }

    removePolygonFromList(id: number): boolean {
        if (id === this.currentPolygonId) {
            // We cannot remove the current polygon.
            // This prevents from getting an empty polygon list.
            return false
        }
        const indexOfItemToRemove = this.polygonList.findIndex(
            (p) => p.id === id
        )
        if (indexOfItemToRemove < 0) return false

        this.polygonList.splice(indexOfItemToRemove, 1)
        this.firePolygonListChanged()
        return true
    }

    getCurrentPolygon(): PolygonItem {
        const current = this.polygonList.find(
            (p) => p.id === this.currentPolygonId
        )
        if (current) return { ...current }

        // We cannot find any polygon with the current id.
        // That's kind of an impossible situation, so we must fix it.
        console.error(`There is no polygon with id #${this.currentPolygonId}!`)
        console.error("That means that the selected polygon has gone.")
        if (this.polygonList.length === 0)
            throw Error("The polygon list is empty!")

        this.currentPolygonId = this.polygonList[0].id
        return { ...this.polygonList[0] }
    }

    makeNewPolygonName(): string {
        const RX = /^([A-Z0-9_]*[A-Z_])([0-9]+)$/gi
        const current = this.getCurrentPolygon()
        const match = RX.exec(current.name)
        const prefix = match ? match[1] : "SPRITE_"
        const start = match ? parseInt(match[2]) : 0
        for (let i = start + 1; i < start + 9999; i++) {
            const name = `${prefix}${i}`
            if (!this.findPolygonByName(name)) return name
        }
        return `${prefix}${Date.now().toString(16)}`
    }

    findPolygonByName(name: string): PolygonItem | undefined {
        const lowerName = name.trim().toLowerCase()
        return this.polygonList.find(
            (p) => p.name.trim().toLowerCase() === lowerName
        )
    }

    readonly save = debounce(() => {
        savePolygonItems(this.storage, this.polygonList)
    }, DEBOUNCE_SAVE_DELAY)

    private getFreeId(): number {
        const maxId = this.polygonList
            .map((p) => p.id)
            .reduce((previous, current) => Math.max(previous, current), 0)
        return maxId + 1
    }
}
