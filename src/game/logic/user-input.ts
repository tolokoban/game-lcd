export type UserInputHandler = (action: "left" | "right") => void

const keyHandlers = new Map<
    UserInputHandler,
    [(evt: KeyboardEvent) => void, (evt: KeyboardEvent) => void]
>()
const pointerHandlers = new Map<
    UserInputHandler,
    [(evt: PointerEvent) => void, (evt: PointerEvent) => void]
>()

export function attachUserInputHandler(handler: UserInputHandler) {
    const handleActionOn = (action: "left" | "right") => {
        handler(action)
        document.body.classList.add(`button-${action}`)
    }
    const handleActionOff = (action: "left" | "right") => {
        document.body.classList.remove(`button-${action}`)
    }
    if (!keyHandlers.has(handler)) {
        const keyDownHandler = (evt: KeyboardEvent) => {
            switch (evt.key) {
                case "ArrowRight":
                    handleActionOn("right")
                    break
                case "ArrowLeft":
                    handleActionOn("left")
                    break
            }
        }
        const keyUpHandler = (evt: KeyboardEvent) => {
            switch (evt.key) {
                case "ArrowRight":
                    handleActionOff("right")
                    break
                case "ArrowLeft":
                    handleActionOff("left")
                    break
            }
        }
        document.addEventListener("keydown", keyDownHandler, true)
        document.addEventListener("keyup", keyUpHandler, true)
        keyHandlers.set(handler, [keyDownHandler, keyUpHandler])
    }
    if (!pointerHandlers.has(handleActionOn)) {
        const makePointerHandler =
            (handleAction: (action: "left" | "right") => void) =>
            (evt: PointerEvent) => {
                const container = document.getElementById("GAME")
                if (!container) throw Error("No element found with id GAME!")

                const { width, height } = container.getBoundingClientRect()
                if (width > height) {
                    if (evt.clientY < height / 2) return

                    if (evt.clientX < width / 2) handleAction("left")
                    else handleAction("right")
                } else {
                    if (evt.clientX > width / 2) return

                    if (evt.clientY < height / 2) handleAction("left")
                    else handleAction("right")
                }
            }
        const pointerDownHandler = makePointerHandler(handleActionOn)
        const pointerUpHandler = makePointerHandler(handleActionOff)
        const container = document.getElementById("GAME")
        if (container) {
            container.addEventListener("pointerdown", pointerDownHandler, true)
            container.addEventListener("pointerup", pointerUpHandler, true)
        }
        pointerHandlers.set(handleActionOn, [
            pointerDownHandler,
            pointerUpHandler,
        ])
    }
}

export function detachUserInputHandler(handler: UserInputHandler) {
    const keyHandler = keyHandlers.get(handler)
    if (keyHandler) {
        const [keyUpHandler, keyDownHandler] = keyHandler
        document.removeEventListener("keydown", keyDownHandler, true)
        document.removeEventListener("keyup", keyUpHandler, true)
        keyHandlers.delete(handler)
    }
    const pointerHandler = pointerHandlers.get(handler)
    if (pointerHandler) {
        const container = document.getElementById("GAME")
        if (container) {
            const [pointerDownHandler, pointerUpHandler] = pointerHandler
            container.removeEventListener(
                "pointerdown",
                pointerDownHandler,
                true
            )
            container.removeEventListener("pointerup", pointerUpHandler, true)
        }
        pointerHandlers.delete(handler)
    }
}
