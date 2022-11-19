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

    const startButton = document.getElementById("start-button")
    if (!startButton) throw Error('No element with id "start-button"!')

    startButton.classList.add("reveal")
    const progress = document.getElementById("loading-in-progress")
    if (progress) progress.style.display = "none"

    const splash = document.getElementById("splash")
    if (!splash) throw Error('Missing div with id "splash"!')

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
        }, 500)
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
