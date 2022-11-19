import * as React from "react"
import BackgroundURL from "@/gfx/background.webp"
import Editor from "./editor"
import ForegroundURL from "@/gfx/frame.webp"
import MetalURL from "@/gfx/frame-texture.jpg"
import SpritesURL from "@/gfx/sprites.webp"
import { createRoot } from "react-dom/client"
import { Game } from "./game/game"
import "./index.css"
import Wave from "./wave"
import { getHiScore } from "./game/hi-score"

async function start() {
    const container = document.getElementById("app")
    if (!container) throw Error(`No element with id "app"!`)

    const root = createRoot(container)
    if (window.location.hash === "#edit") {
        root.render(<Editor />)
        removeSplash()
        return
    }

    if (window.location.hash === "#wave") {
        root.render(<Wave />)
        removeSplash()
        return
    }

    const backgroundImage = await loadImage(BackgroundURL)
    const spritesImage = await loadImage(SpritesURL)
    const foregroundImage = await loadImage(ForegroundURL)
    const metalImage = await loadImage(MetalURL)

    get("hi-score").textContent = `Hi Score: ${getHiScore()}`
    get("start-button").classList.add("reveal")
    get("loading-in-progress").style.display = "none"
    const splash = get("splash")
    const handleStart = async () => {
        const result = await document.body.requestFullscreen()
        window.setTimeout(() => {
            root.render(
                <Game
                    images={{
                        backgroundImage,
                        spritesImage,
                        foregroundImage,
                        metalImage,
                    }}
                    onReady={removeSplash}
                />
            )
        }, 300)
    }
    splash.addEventListener("click", handleStart, true)
}

function removeSplash() {
    const splash = document.getElementById("splash")
    if (!splash) throw Error('Missing div with id "splash"!')

    splash.classList.add("vanish")
    window.setTimeout(() => {
        splash.parentElement?.removeChild(splash)
    }, 300)
}

void start()

function get(id: string): HTMLElement | SVGElement {
    const elem = document.getElementById(id)
    if (!elem) throw Error(`There is no element with id "${id}"!`)
    return elem
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
