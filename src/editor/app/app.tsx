import * as React from "react"
import EditorView from "../view/editor"
import ImageURL from "../../gfx/sprites.webp"
import painter from "./painter"
import PolygonsList from "../view/polygons-list"
import { generateCode } from "./exporter/exporter"
import { useDataContext } from "../data/hooks"
import { useKeyboardShortcuts } from "./keyboard-shortcuts"
import { useSelection } from "./selection"
import "./app.css"

export interface AppProps {
    className?: string
}

export default function App(props: AppProps) {
    const data = useDataContext()
    const refPainter = React.useRef(new painter(data))
    useKeyboardShortcuts(data)
    useSelection(data, refPainter.current)
    React.useEffect(() => {
        const img = new Image()
        img.src = ImageURL
        img.onload = () => {
            refPainter.current.image = img
        }
    }, [])
    React.useEffect(() => {
        const painter = refPainter.current
        const handler = () =>
            data.updatePolygon({
                points: painter.polygon.points,
            })
        painter.polygon.eventChange.add(handler)
        painter.resetPolygon(data.getCurrentPolygon())
        return () => painter.polygon.eventChange.remove(handler)
    }, [data, refPainter.current])
    const handleExportCode = () => {
        const code = generateCode(data, refPainter.current.image)
        console.log(code)
        navigator.clipboard.writeText(code)
    }
    return (
        <div className={getClassNames(props)}>
            <EditorView painter={refPainter.current} />
            <aside>
                <button>Load Image</button>
                <PolygonsList />
                <button onClick={handleExportCode}>Export Code</button>
            </aside>
        </div>
    )
}

function getClassNames(props: AppProps): string {
    const classNames = ["custom", "App"]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }

    return classNames.join(" ")
}
