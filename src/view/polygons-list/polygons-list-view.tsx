import * as React from "react"
import Polygon from "@/app/painter/polygon"
import PolygonButton from "../polygon-button"
import { PolygonItem } from "@/data/types"
import "./polygons-list-view.css"
import {
    useDataContext,
    usePolygonList,
    useSelectedPolygonId,
} from "@/data/hooks"

export interface PolygonsListViewProps {
    className?: string
    onClick(this: void, polygon: PolygonItem): void
}

export default function PolygonsListView(props: PolygonsListViewProps) {
    const data = useDataContext()
    const polygons = usePolygonList()
    const selectedPolygonId = useSelectedPolygonId()
    const handleNewPolygon = () => data.addPolygonToList()
    const handleDeletePolygon = (id: number) => data.removePolygonFromList(id)
    const handleSelectPolygon = (id: number) => {
        data.currentPolygonId = id
        props.onClick(data.getCurrentPolygon())
    }
    return (
        <div className={getClassNames(props)}>
            <div className="list">
                {polygons.map((poly) => (
                    <PolygonButton
                        key={poly.id}
                        selected={poly.id === selectedPolygonId}
                        value={poly}
                        onSelect={handleSelectPolygon}
                        onDelete={handleDeletePolygon}
                    />
                ))}
            </div>
            <button onClick={handleNewPolygon}>Add new Polygon</button>
        </div>
    )
}

function getClassNames(props: PolygonsListViewProps): string {
    const classNames = ["custom", "view-PolygonsListView"]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }

    return classNames.join(" ")
}
