import Data from "../data"
import React from "react"

export function useKeyboardShortcuts(data: Data) {
    React.useEffect(() => {
        const handler = (evt: KeyboardEvent) => {
            const modifier =
                (evt.shiftKey ? 1 : 0) +
                (evt.ctrlKey ? 2 : 0) +
                (evt.altKey ? 4 : 0)
            console.log("🚀 [polygons-order] evt.key = ", evt.key) // @FIXME: Remove this line written on 2022-10-10 at 15:54
            switch (evt.key) {
                case "ArrowDown":
                    evt.preventDefault()
                    evt.stopPropagation()
                    if (modifier === 0) moveSelection(data, +1)
                    else data.moveCurrentDown()
                    break
                case "ArrowUp":
                    evt.preventDefault()
                    evt.stopPropagation()
                    if (modifier === 0) moveSelection(data, -1)
                    else data.moveCurrentUp()
                    break
                case "+":
                    if (modifier === 0) {
                        evt.preventDefault()
                        evt.stopPropagation()
                        data.duplicateCurrentPolygon()
                    }
            }
        }
        window.document.addEventListener("keydown", handler, true)
        return () =>
            window.document.removeEventListener("keydown", handler, true)
    }, [data])
}

function moveSelection(data: Data, shift: number) {
    const polygons = data.getPolygonList()
    const index = polygons.findIndex((p) => p.id === data.currentPolygonId)
    if (index < 0) return

    const nextIndex = (index + shift + polygons.length) % polygons.length
    data.currentPolygonId = polygons[nextIndex].id
}
