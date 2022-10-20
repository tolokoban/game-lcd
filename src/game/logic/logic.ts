import GenericEvent from "../../editor/tool/generic-event"
import Painter from "../painter"
import { attachUserInputHandler, UserInputHandler } from "./user-input"
import { makeSprites } from "./make-sprites"

const MORTY_PATH_LENGTH = 10
const RICK_PATH_LENGTH = 4
const MORTY_STEP_DURATION = 1000
// Used to quiclky divide the time to get the current Morty's tick.
const MORTY_TICK = 1 / MORTY_STEP_DURATION
// In the the bottom line, Morty's move at the same speed of above,
// but not at the same time. There is a shift.
const MORTY_SHIFT = MORTY_STEP_DURATION / 2

interface Trap {
    lane: "top" | "bot"
    // Sprite of a Rick above a trap:
    // MORTY_TOP_3, MORTY_TOP_6,
    // MORTY_BOT_3, MORTY_BOT_6.
    trapSprite: number
    // Where Rick should be to prevent Rick
    // from falling.
    // RICK_TOP_LEFT, ...
    whereRickShouldBe: number
    // If Morty falls, we will play this sprites animation.
    fallAnimation: number[]
}

const TRAPS: Trap[] = [
    {
        lane: "top",
        trapSprite: Painter.MORTY_TOP_3,
        whereRickShouldBe: Painter.RICK_TOP_LEFT,
        fallAnimation: [Painter.FALL_TOP_LEFT],
    },
    {
        lane: "top",
        trapSprite: Painter.MORTY_TOP_6,
        whereRickShouldBe: Painter.RICK_TOP_RIGHT,
        fallAnimation: [Painter.FALL_TOP_RIGHT],
    },
]
const TRAPS_TOP = TRAPS.filter((trap) => trap.lane === "top")
const TRAPS_BOT = TRAPS.filter((trap) => trap.lane === "bot")

export default class Logic {
    public readonly sprites = makeSprites()
    public readonly eventScoreUpdate = new GenericEvent<number>()
    public readonly eventMiss = new GenericEvent<void>()

    private rickIndex = 0
    private readonly mortyTopIndexes: number[]
    private readonly mortyBotIndexes: number[]
    private lastTopTick = -1
    private lastBotTick = -1
    private time = 0
    // When mode is "look", the user cannot move, but jut look at the cinematic.
    private mode: "play" | "look" = "play"
    private cinematic: Array<[time: number, action: () => void]> = []

    constructor(private readonly painter: Painter) {
        attachUserInputHandler(this.inputHandler)
        const top1 = -1
        const top2 = top1 - MORTY_PATH_LENGTH - rnd(0, 2)
        const top3 = top2 - MORTY_PATH_LENGTH - rnd(0, 2)
        this.mortyTopIndexes = [top1, top2, top3]
        const bot1 = rnd(-2, -7)
        const bot2 = bot1 - MORTY_PATH_LENGTH - rnd(0, 2)
        const bot3 = bot2 - MORTY_PATH_LENGTH - rnd(0, 2)
        this.mortyBotIndexes = [bot1, bot2, bot3]
        this.sprites.on("rick", this.rickIndex)
    }

    play(time: number) {
        this.time = time
        const { mode } = this
        if (mode === "play") {
            this.playMortyTop(time)
            this.playMortyBot(time)
            return
        }

        const { cinematic } = this
        if (cinematic.length === 0) {
            this.mode = "play"
            this.eventMiss.fire()
            return
        }
        while (cinematic.length > 0) {
            const [startTime, action] = cinematic[0]
            if (startTime > time) break

            cinematic.shift()
            action()
        }
    }

    private onMorty(name: "mortyTop" | "mortyBot") {
        this.sprites.clear(name)
        const indexes =
            name === "mortyTop" ? this.mortyTopIndexes : this.mortyBotIndexes
        const filteredIndexes = indexes.filter(
            (idx) => idx >= 0 && idx < MORTY_PATH_LENGTH
        )
        if (filteredIndexes.length === 0) return

        this.sprites.on(name, ...filteredIndexes)
    }

    private addToScore(value: number) {
        this.eventScoreUpdate.fire(value)
    }

    private playMortyTop(time: number) {
        const tick = Math.floor(time * MORTY_TICK)
        if (tick !== this.lastTopTick) {
            this.lastTopTick = tick
            // Move one step forward.
            this.moveMorty(this.mortyTopIndexes, (mortyStep: number) => {
                if (mortyStep === 3) {
                    if (this.sprites.isOff("rickTopLeft")) {
                        this.createCinematic("mortyTop", mortyStep)
                        return true
                    }
                    this.addToScore(1)
                } else if (mortyStep === 6) {
                    if (this.sprites.isOff("rickTopRight")) {
                        this.createCinematic("mortyTop", mortyStep)
                        return true
                    }
                    this.addToScore(1)
                }
                return false
            })
            this.onMorty("mortyTop")
        }
    }

    private playMortyBot(time: number) {
        const tick = Math.floor((time + MORTY_SHIFT) * MORTY_TICK)
        if (tick !== this.lastBotTick) {
            this.lastBotTick = tick
            // Move one step forward.
            this.moveMorty(this.mortyBotIndexes, (mortyStep: number) => {
                if (mortyStep === 3) {
                    if (this.sprites.isOff("rickBotRight")) {
                        this.createCinematic("mortyBot", mortyStep)
                        return true
                    }
                    this.addToScore(1)
                } else if (mortyStep === 6) {
                    if (this.sprites.isOff("rickBotLeft")) {
                        this.createCinematic("mortyBot", mortyStep)
                        return true
                    }
                    this.addToScore(1)
                }
                return false
            })
            this.onMorty("mortyBot")
        }
    }

    /**
     *
     * @param mortyIndexes Position of all the mortys on this line.
     * @param onMove Called everytime a Morty make a step forward in the visible line.
     * Returns `true` if Morty has fallen and should be removed.
     */
    private moveMorty(
        mortyIndexes: number[],
        onMove: (mortyStep: number) => boolean
    ) {
        for (let k = 0; k < mortyIndexes.length; k++) {
            // Move one step forward.
            let pos = mortyIndexes[k] + 1
            if (pos >= MORTY_PATH_LENGTH) {
                // Return to start.
                const prevPos = min(mortyIndexes)
                if (prevPos > 2) pos = rnd(-1, -9)
                else {
                    pos = Math.min(-1, prevPos) - rnd(0, 9)
                    if (prevPos - pos === 3) pos--
                }
            }
            mortyIndexes[k] = pos
            if (pos >= 0 && pos < MORTY_PATH_LENGTH) {
                if (onMove(pos)) mortyIndexes[k] = MORTY_PATH_LENGTH
            }
        }
    }

    private readonly inputHandler: UserInputHandler = (action) => {
        // Inputs are disabled during cinematics.
        if (this.mode !== "play") return

        switch (action) {
            case "left":
                return this.moveRickLeft()
            case "right":
                return this.moveRickRight()
        }
    }

    private moveRickRight() {
        this.rickIndex = (this.rickIndex + 1) % RICK_PATH_LENGTH
        this.paintRick()
    }

    private moveRickLeft() {
        this.rickIndex =
            (this.rickIndex - 1 + RICK_PATH_LENGTH) % RICK_PATH_LENGTH
        this.paintRick()
    }

    private paintRick() {
        this.sprites.clear("rick")
        this.sprites.on("rick", this.rickIndex)
    }

    private createCinematic(name: "mortyTop" | "mortyBot", step: number) {
        this.resetCinematic()
        this.addToCinematic(0, () => this.sprites.on(name, step))
        for (let loop = 0; loop < 4; loop++) {
            this.addToCinematic(300, () => this.sprites.off(name, step))
            this.addToCinematic(300, () => this.sprites.on(name, step))
        }
        this.addToCinematic(300, () => this.sprites.off(name, step))
    }

    private resetCinematic() {
        this.cinematic = []
        this.mode = "look"
    }

    private addToCinematic(delay: number, action: () => void) {
        if (this.cinematic.length === 0) {
            this.cinematic.push([delay + this.time, action])
            return
        }
        const [time] = this.cinematic.at(-1) as [number, () => void]
        this.cinematic.push([time + delay, action])
    }
}

function rnd(a: number, b: number): number {
    return a + Math.floor(Math.random() * (b - a))
}

function min(arr: number[]): number {
    return arr.reduce((acc, val) => Math.min(acc, val), Number.MAX_SAFE_INTEGER)
}
