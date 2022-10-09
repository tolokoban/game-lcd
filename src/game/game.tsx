import * as React from "react"
import BackgroundURL from "./background.webp"
import ForegroundURL from "./foreground.webp"
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
        // await loadImage(BackgroundURL),
        // await loadImage(ForegroundURL),
        await loadImage(TestURL),
        await loadImage(TestURL)
    )
    painter.onAll()
    const draw = (time: number) => {
        window.requestAnimationFrame(draw)
        const index = Math.floor(time / 1000) % 4
        painter.offAll()
        painter.on(index)
        painter.draw()
    }
    window.requestAnimationFrame(draw)
}

async function loadImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve) => {
        const img = new Image()
        img.src = url
        img.onload = () => resolve(img)
        img.onerror = () => resolve(img)
    })
}
