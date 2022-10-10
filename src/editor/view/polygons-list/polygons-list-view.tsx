import * as React from "react"
import Polygon from "@/editor/app/painter/polygon"
import PolygonButton from "../polygon-button"
import { PolygonItem } from "@/editor/data/types"
import "./polygons-list-view.css"
import {
    useDataContext,
    usePolygonList,
    useSelectedPolygonId,
} from "@/editor/data/hooks"

export interface PolygonsListViewProps {
    className?: string
}

export default function PolygonsListView(props: PolygonsListViewProps) {
    const data = useDataContext()
    const polygons = usePolygonList()
    const selectedPolygonId = useSelectedPolygonId()
    const handleNewPolygon = () => data.duplicateCurrentPolygon()
    const handleDeletePolygon = (id: number) => data.removePolygonFromList(id)
    const handleSelectPolygon = (id: number) => {
        data.currentPolygonId = id
    }
    const handleNameChange = (id: number, name: string) => {
        data.updatePolygon({ name })
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
                        onNameChange={handleNameChange}
                    />
                ))}
            </div>
            <button onClick={handleNewPolygon}>Duplicate Polygon (+)</button>
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
