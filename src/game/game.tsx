import * as React from "react"
import BackgroundURL from "./background.webp"
import ForegroundURL from "./foreground.webp"
import Logic from "./logic"
import Painter from "./painter"
import TestURL from "./test.webp"
import "./game.css"

export function Game() {
    return <canvas className="game" ref={mountCanvas}></canvas>
}

async function mountCanvas(canvas: HTMLCanvasElement) {
    const gl = canvas.getContext("webgl2")
    if (!gl) throw Error("Unable to create WebGL2RenderingContext!")

    const painter = new Painter(
        gl,
        await loadImage(BackgroundURL),
        await loadImage(ForegroundURL)
    )
    painter.onAll()
    const logic = new Logic(painter)
    const draw = (time: number) => {
        window.requestAnimationFrame(draw)
        logic.play(time)
        painter.draw()
    }
    window.requestAnimationFrame(draw)
}

async function loadImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve) => {
        const img = new Image()
        img.src = url
        img.onload = () => {
            console.log("Loaded:", url)
            resolve(img)
        }
        img.onerror = () => {
            console.error("Unable to load:", url)
            resolve(img)
        }
    })
}
