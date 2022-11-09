import * as React from "react"
import Logic from "./logic/logic"
import Painter from "./painter"
import TestURL from "./test.webp"
import "./game.css"

interface GameImages {
    backgroundImage: HTMLImageElement
    spritesImage: HTMLImageElement
    foregroundImage: HTMLImageElement
    metalImage: HTMLImageElement
}

export interface GameProps {
    images: GameImages
}

export function Game(props: GameProps) {
    return (
        <div className="game">
            <canvas
                ref={(canvas) => {
                    if (canvas) mountCanvas(canvas, props.images)
                }}
            ></canvas>
            <div className="button-red left"></div>
            <div className="button-red right"></div>
        </div>
    )
}

async function mountCanvas(canvas: HTMLCanvasElement, images: GameImages) {
    const gl = canvas.getContext("webgl2", {
        antialias: false,
    })
    if (!gl) throw Error("Unable to create WebGL2RenderingContext!")

    const painter = new Painter(
        gl,
        images.backgroundImage,
        images.spritesImage,
        images.foregroundImage,
        images.metalImage
    )
    const logic = new Logic(painter)
    const draw = (time: number) => {
        logic.play(time)
        painter.draw(logic.sprites.list())
        window.requestAnimationFrame(draw)
    }
    window.requestAnimationFrame(draw)
}
