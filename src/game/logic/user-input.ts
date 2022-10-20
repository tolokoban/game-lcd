export type UserInputHandler = (action: "left" | "right") => void

const keyHandlers = new Map<UserInputHandler, (evt: KeyboardEvent) => void>()
const pointerHandlers = new Map<UserInputHandler, (evt: PointerEvent) => void>()

export function attachUserInputHandler(handler: UserInputHandler) {
    if (!keyHandlers.has(handler)) {
        const keyHandler = (evt: KeyboardEvent) => {
            switch (evt.key) {
                case "ArrowRight":
                    handler("right")
                    break
                case "ArrowLeft":
                    handler("left")
                    break
            }
        }
        document.addEventListener("keydown", keyHandler, true)
        keyHandlers.set(handler, keyHandler)
    }
    if (!pointerHandlers.has(handler)) {
        const pointerHandler = (evt: PointerEvent) => {
            const { width, height } =
                window.document.body.getBoundingClientRect()
            if (evt.clientY < height / 2) return

            if (evt.clientX < width / 2) handler("left")
            else handler("right")
        }
        document.addEventListener("pointerdown", pointerHandler, true)
        pointerHandlers.set(handler, pointerHandler)
    }
}

export function detachUserInputHandler(handler: UserInputHandler) {
    const keyHandler = keyHandlers.get(handler)
    if (keyHandler) {
        document.removeEventListener("keydown", keyHandler, true)
        keyHandlers.delete(handler)
    }
    const pointerHandler = pointerHandlers.get(handler)
    if (pointerHandler) {
        document.removeEventListener("pointerdown", pointerHandler, true)
        pointerHandlers.delete(handler)
    }
}
