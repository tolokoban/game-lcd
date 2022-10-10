import * as React from "react"
import { PolygonItem } from "@/editor/data/types"
import "./polygon-button-view.css"

export interface PolygonButtonViewProps {
    className?: string
    selected: boolean
    value: PolygonItem
    onSelect(this: void, id: number): void
    onDelete(this: void, id: number): void
    onNameChange(this: void, id: number, name: string): void
}

export default function PolygonButtonView(props: PolygonButtonViewProps) {
    const [name, setName] = React.useState(props.value.name)
    const poly = props.value
    React.useEffect(() => {
        props.onNameChange(poly.id, name)
    }, [name, poly])
    return (
        <div className={getClassNames(props)} title={`#${poly.id}`}>
            {props.selected && (
                <input
                    value={name}
                    autoFocus={true}
                    onChange={(evt) => setName(sanitizeName(evt.target.value))}
                />
            )}
            {!props.selected && (
                <div className="label" onClick={() => props.onSelect(poly.id)}>
                    {props.value.name}
                </div>
            )}
            {!props.selected && (
                <button
                    className="floating-button"
                    onClick={() => props.onDelete(poly.id)}
                >
                    <svg viewBox="0 0 24 24">
                        <path
                            fill="currentColor"
                            d="M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19M8.46,11.88L9.87,10.47L12,12.59L14.12,10.47L15.53,11.88L13.41,14L15.53,16.12L14.12,17.53L12,15.41L9.88,17.53L8.47,16.12L10.59,14L8.46,11.88M15.5,4L14.5,3H9.5L8.5,4H5V6H19V4H15.5Z"
                        />
                    </svg>
                </button>
            )}
        </div>
    )
}

function getClassNames(props: PolygonButtonViewProps): string {
    const classNames = ["custom", "view-PolygonButtonView"]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }
    if (props.selected) classNames.push("selected")

    return classNames.join(" ")
}

function sanitizeName(value: string): string {
    let result = ""
    for (const c of value) {
        const C = c.toUpperCase()
        if (C >= "0" && C <= "9") result += C
        else if (C >= "A" && C <= "Z") result += C
        else result += "_"
    }
    return result !== value ? result : value
}
