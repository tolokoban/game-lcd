import * as React from "react"
import Painter from "../../app/painter"
import "./editor-view.css"

export interface EditorViewProps {
    className?: string
    painter: Painter
}

export default function EditorView(props: EditorViewProps) {
    const mountCanvas = (canvas: HTMLCanvasElement | null) => {
        if (canvas) props.painter.canvas = canvas
    }
    return <canvas className={getClassNames(props)} ref={mountCanvas}></canvas>
}

function getClassNames(props: EditorViewProps): string {
    const classNames = ["custom", "view-EditorView"]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }

    return classNames.join(" ")
}
