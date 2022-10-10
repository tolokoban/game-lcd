import Painter from "./painter"

const TICK = 1 / 1000
const SHIFT = 500

export default class Logic {
    private readonly ricks = [
        Painter.RICK_TOP_LEFT,
        Painter.RICK_TOP_RIGHT,
        Painter.RICK_BOTTOM_RIGHT,
        Painter.RICK_BOTTOM_LEFT,
    ]
    private readonly mortysTop = [
        Painter.MORTY_TOP_0,
        Painter.MORTY_TOP_1,
        Painter.MORTY_TOP_2,
        Painter.MORTY_TOP_3,
        Painter.MORTY_TOP_4,
        Painter.MORTY_TOP_5,
        Painter.MORTY_TOP_6,
        Painter.MORTY_TOP_7,
        Painter.MORTY_TOP_8,
        Painter.MORTY_TOP_9,
    ]
    private readonly mortysBottom = [
        Painter.MORTY_BOTTOM_0,
        Painter.MORTY_BOTTOM_1,
        Painter.MORTY_BOTTOM_2,
        Painter.MORTY_BOTTOM_3,
        Painter.MORTY_BOTTOM_4,
        Painter.MORTY_BOTTOM_5,
        Painter.MORTY_BOTTOM_6,
        Painter.MORTY_BOTTOM_7,
        Painter.MORTY_BOTTOM_8,
        Painter.MORTY_BOTTOM_9,
    ]

    private rickIndex = 0
    private mortyTopIndexes = [0]
    private mortyBottomIndexes = [0]

    constructor(private readonly painter: Painter) {
        document.addEventListener("keydown", this.handleKeyDown, true)
        document.addEventListener("pointerdown", this.handlePointerDown, true)
    }

    play(time: number) {
        const { painter } = this
        painter.offAll()
        this.playMortyTop(time)
        this.playMortyBottom(time)
        Math.floor(time / 1000) % this.mortysTop.length
        painter.on(this.ricks[this.rickIndex])
    }

    private playMortyTop(time: number) {
        const tick = Math.floor(time * TICK)
        this.painter.on(this.mortysTop[tick % this.mortysTop.length])
    }

    private playMortyBottom(time: number) {
        const tick = Math.floor((time + SHIFT) * TICK)
        this.painter.on(this.mortysBottom[tick % this.mortysBottom.length])
    }

    private moveRickRight() {
        this.rickIndex = (this.rickIndex + 1) % this.ricks.length
    }

    private moveRickLeft() {
        this.rickIndex =
            (this.rickIndex - 1 + this.ricks.length) % this.ricks.length
    }

    private readonly handleKeyDown = (evt: KeyboardEvent) => {
        switch (evt.key) {
            case "ArrowRight":
                this.moveRickRight()
                break
            case "ArrowLeft":
                this.moveRickLeft()
                break
        }
    }

    private readonly handlePointerDown = (evt: PointerEvent) => {
        const { width, height } = window.document.body.getBoundingClientRect()
        if (evt.clientY < height / 2) return

        if (evt.clientX < width / 2) this.moveRickLeft()
        else this.moveRickRight()
    }
}
