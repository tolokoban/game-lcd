import * as React from "react"
import BackgroundURL from "@/gfx/background.webp"
import ForegroundURL from "@/gfx/foreground.webp"
import Logic from "./logic/logic"
import Painter from "./painter"
import TestURL from "./test.webp"
import "./game.css"

export function Game() {
    return (
        <div className="game">
            <canvas ref={mountCanvas}></canvas>
            <div id="score">0</div>
        </div>
    )
}

async function mountCanvas(canvas: HTMLCanvasElement) {
    const scoreDiv = document.getElementById("score")
    if (!scoreDiv) throw Error("Missing div with id score!")

    const gl = canvas.getContext("webgl2")
    if (!gl) throw Error("Unable to create WebGL2RenderingContext!")

    const painter = new Painter(
        gl,
        await loadImage(BackgroundURL),
        await loadImage(ForegroundURL)
    )
    let score = 0
    const logic = new Logic(painter)
    logic.eventScoreUpdate.add((value) => {
        score = Math.max(0, score + value)
        scoreDiv.textContent = `${score}`
    })
    logic.eventMiss.add(() => {
        score = Math.max(0, score - 5)
        scoreDiv.textContent = `${score}`
    })
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
