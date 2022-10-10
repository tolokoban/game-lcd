import * as React from "react"
import Data from "./data"
import DataContext from "./provider"
import { PolygonItem } from "./types"

export function useDataContext(): Data {
    return React.useContext(DataContext)
}

export function usePolygonList(): PolygonItem[] {
    const data = useDataContext()
    const [polygonList, setPolygonList] = React.useState<PolygonItem[]>(
        data.getPolygonList()
    )
    React.useEffect(() => {
        data.eventPolygonListChange.add(setPolygonList)
        return () => data.eventPolygonListChange.remove(setPolygonList)
    }, [data])
    return polygonList
}

export function useSelectedPolygonId(): number {
    const data = useDataContext()
    const [polygonId, setPolygonId] = React.useState<number>(
        data.currentPolygonId
    )
    React.useEffect(() => {
        data.eventCurrentPolygonChange.add(setPolygonId)
        return () => data.eventCurrentPolygonChange.remove(setPolygonId)
    }, [data])
    return polygonId
}
