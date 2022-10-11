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
    private readonly mortysBot = [
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
    private readonly mortyTopIndexes: number[]
    private readonly mortyBotIndexes: number[]
    private lastTopTick = -1
    private lastBotTick = -1
    private time = 0
    private deadTime = 0
    private deadIndex = 0

    constructor(private readonly painter: Painter) {
        document.addEventListener("keydown", this.handleKeyDown, true)
        document.addEventListener("pointerdown", this.handlePointerDown, true)
        const top1 = -1
        const top2 = top1 - this.mortysTop.length - rnd(0, 2)
        const top3 = top2 - this.mortysTop.length - rnd(0, 2)
        this.mortyTopIndexes = [top1, top2, top3]
        const bot1 = rnd(-2, -7)
        const bot2 = bot1 - this.mortysTop.length - rnd(0, 2)
        const bot3 = bot2 - this.mortysTop.length - rnd(0, 2)
        this.mortyBotIndexes = [bot1, bot2, bot3]
    }

    play(time: number) {
        this.time = time
        const { painter } = this
        painter.offAll()
        this.playMortyTop(time)
        this.playMortyBot(time)
        painter.on(this.ricks[this.rickIndex])
        for (const indexTop of this.mortyTopIndexes) {
            if (indexTop >= 0 && indexTop < this.mortysTop.length) {
                painter.on(this.mortysTop[indexTop])
            }
        }
        for (const indexBot of this.mortyBotIndexes) {
            if (indexBot >= 0 && indexBot < this.mortysBot.length) {
                painter.on(this.mortysBot[indexBot])
            }
        }
    }

    private playMortyTop(time: number) {
        const tick = Math.floor(time * TICK)
        if (tick !== this.lastTopTick) {
            this.lastTopTick = tick
            // Move one step forward.
            this.moveMorty(
                this.mortyTopIndexes,
                Painter.FALL_TOP_LEFT,
                Painter.FALL_TOP_RIGHT
            )
        }
    }

    private playMortyBot(time: number) {
        const tick = Math.floor((time + SHIFT) * TICK)
        if (tick !== this.lastBotTick) {
            this.lastBotTick = tick
            // Move one step forward.
            this.moveMorty(
                this.mortyBotIndexes,
                Painter.FALL_BOTTOM_RIGHT,
                Painter.FALL_BOTTOM_LEFT
            )
        }
    }

    private moveMorty(mortyIndexes: number[], fall1: number, fall2: number) {
        for (let k = 0; k < mortyIndexes.length; k++) {
            // Move one step forward.
            let pos = mortyIndexes[k] + 1
            if (pos >= 10) {
                // Return to start.
                const previous =
                    (k - 1 + mortyIndexes.length) % mortyIndexes.length
                const prevPos = mortyIndexes[previous]
                if (prevPos > 2) pos = rnd(-1, -9)
                else {
                    pos = Math.min(-1, prevPos) - rnd(0, 9)
                    if (prevPos - pos === 3) pos--
                }
            }
            mortyIndexes[k] = pos
        }
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

function rnd(a: number, b: number): number {
    return a + Math.floor(Math.random() * (b - a))
}
