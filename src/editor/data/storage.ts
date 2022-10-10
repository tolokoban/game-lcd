import JSON5 from "json5"
import { isPolygonItemArray, PolygonItem, StorageInterface } from "./types"

const STORAGE_KEY = "PolygonItems"

export function loadPolygonItems(storage: StorageInterface): PolygonItem[] {
    try {
        const data = storage.getItem(STORAGE_KEY)
        if (data === null) return makeDefaultPolygonItemArray()

        const items = JSON5.parse(data)
        if (!isPolygonItemArray(items) || items.length === 0)
            return makeDefaultPolygonItemArray()
        return items
    } catch (ex) {
        console.error("Unable to retrieve PolygonItems:", ex)
        return makeDefaultPolygonItemArray()
    }
}

export function savePolygonItems(
    storage: StorageInterface,
    items: PolygonItem[]
) {
    storage.setItem(
        STORAGE_KEY,
        JSON5.stringify(
            items.map((item, index) => ({
                ...item,
                id: index + 1,
            }))
        )
    )
}

function makeDefaultPolygonItemArray(): PolygonItem[] {
    return [
        {
            id: 1,
            name: "SPRITE_0",
            points: [],
        },
    ]
}
