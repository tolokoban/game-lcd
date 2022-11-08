import * as React from "react"
import BackgroundURL from "@/gfx/background.webp"
import ForegroundURL from "@/gfx/frame.webp"
import Logic from "./logic/logic"
import MetalURL from "@/gfx/frame-texture.jpg"
import Painter from "./painter"
import SpritesURL from "@/gfx/sprites.webp"
import TestURL from "./test.webp"
import "./game.css"

export function Game() {
    return (
        <div className="game">
            <canvas ref={mountCanvas}></canvas>
            <div className="button-red left"></div>
            <div className="button-red right"></div>
        </div>
    )
}

async function mountCanvas(canvas: HTMLCanvasElement) {
    const gl = canvas.getContext("webgl2", {
        antialias: false,
    })
    if (!gl) throw Error("Unable to create WebGL2RenderingContext!")

    const painter = new Painter(
        gl,
        await loadImage(BackgroundURL),
        await loadImage(SpritesURL),
        await loadImage(ForegroundURL),
        await loadImage(MetalURL)
    )
    let score = 0
    const logic = new Logic(painter)
    const draw = (time: number) => {
        logic.play(time)
        painter.draw(logic.sprites.list())
        window.requestAnimationFrame(draw)
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
