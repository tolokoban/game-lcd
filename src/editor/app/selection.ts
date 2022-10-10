import Data from "../data/data"
import Painter from "./painter"
import React from "react"

export function useSelection(data: Data, painter: Painter) {
    const [selectedId, setSelectedId] = React.useState(-1)
    React.useEffect(() => {
        const handler = () => {
            console.log(
                "🚀 [selection] data.currentPolygonId = ",
                data.currentPolygonId
            ) // @FIXME: Remove this line written on 2022-10-10 at 16:16
            setSelectedId(data.currentPolygonId)
            painter.resetPolygon(data.getCurrentPolygon())
        }
        data.eventCurrentPolygonChange.add(handler)
        return () => data.eventCurrentPolygonChange.remove(handler)
    }, [data, painter])
}
