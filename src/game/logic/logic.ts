import BasePainter from "../base-painter"
import GenericEvent from "../../editor/tool/generic-event"
import Painter from "../painter"
import { attachUserInputHandler, UserInputHandler } from "./user-input"
import { makeSprites } from "./make-sprites"
import { WAVES } from "./waves"
import { setHiScore } from "../hi-score"

const MORTY_PATH_LENGTH = 10
const MORTY_STEP_DURATION = 1000
// Used to quiclky divide the time to get the current Morty's tick.
const MORTY_TICK = 1 / MORTY_STEP_DURATION
// In the the bottom line, Morty's move at the same speed of above,
// but not at the same time. There is a shift.
const MORTY_SHIFT = MORTY_STEP_DURATION / 2

export default class Logic {
    public readonly sprites = makeSprites()
    public readonly eventScoreUpdate = new GenericEvent<number>()
    public readonly eventMiss = new GenericEvent<void>()

    private _score = 0
    private lifes = 3
    private rickIndex = 0
    private readonly mortyTopIndexes: number[] = []
    private readonly mortyBotIndexes: number[] = []
    private lastTopTick = -1
    private lastBotTick = -1
    private time = 0
    // When mode is "look", the user cannot move, but jut look at the cinematic.
    private mode: "play" | "look" = "play"
    private cinematic: Array<[time: number, action: () => void]> = []

    constructor(private readonly painter: Painter) {
        attachUserInputHandler(this.inputHandler)
        this.sprites.on("rick", this.rickIndex)
        this.score = 0
        this.resetMorties()
    }

    get score() {
        return this._score
    }
    set score(value: number) {
        this._score = value
        this.eventScoreUpdate.fire(value)
        this.sprites.off("digit8")
        this.sprites.on(`digit${value % 10}`)
        value = Math.floor(value / 10)
        this.sprites.off("digit80")
        this.sprites.on(`digit${value % 10}0`)
        value = Math.floor(value / 10)
        this.sprites.off("digit800")
        this.sprites.on(`digit${value % 10}00`)
    }

    play(time: number) {
        this.time = time
        const { mode } = this
        this.paintLifes()
        if (mode === "play") {
            this.playMortyTop(time)
            this.playMortyBot(time)
            if (
                this.mortyTopIndexes.length === 0 &&
                this.mortyBotIndexes.length === 0
            ) {
                this.resetMorties()
            }
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
            this.paintLifes()
        }
    }

    paintLifes() {
        const LIFES = [
            BasePainter.LIFE_1,
            BasePainter.LIFE_2,
            BasePainter.LIFE_3,
        ]
        this.sprites.off("lifes")
        const { lifes } = this
        if (lifes > 0) this.sprites.on("life1")
        if (lifes > 1) this.sprites.on("life2")
        if (lifes > 2) this.sprites.on("life3")
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
        this.score += value
    }

    private playMortyTop(time: number) {
        const tick = Math.floor(time * MORTY_TICK)
        if (tick !== this.lastTopTick) {
            this.lastTopTick = tick
            // Move one step forward.
            this.moveMorty(this.mortyTopIndexes, (mortyStep: number) => {
                if (mortyStep === 3) {
                    if (this.sprites.isOff("rickTopLeft")) {
                        this.createCinematicForLifeLost("mortyTop", mortyStep)
                        return true
                    }
                } else if (mortyStep === 6) {
                    if (this.sprites.isOff("rickTopRight")) {
                        this.createCinematicForLifeLost("mortyTop", mortyStep)
                        return true
                    }
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
                        this.createCinematicForLifeLost("mortyBot", mortyStep)
                        return true
                    }
                } else if (mortyStep === 6) {
                    if (this.sprites.isOff("rickBotLeft")) {
                        this.createCinematicForLifeLost("mortyBot", mortyStep)
                        return true
                    }
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
            mortyIndexes[k] = pos
            onMove(pos)
        }
        const inGameMortyIndexes = mortyIndexes.filter(
            (idx) => idx < MORTY_PATH_LENGTH
        )
        const score = mortyIndexes.length - inGameMortyIndexes.length
        if (score > 0) {
            this.addToScore(score)
            resetArray(mortyIndexes, inGameMortyIndexes)
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
        switch (this.rickIndex) {
            case 0:
                this.rickIndex = 1
                break
            case 1:
                this.rickIndex = 2
                break
            case 2:
                this.rickIndex = 1
                break
            case 3:
                this.rickIndex = 2
                break
        }
        this.paintRick()
    }

    private moveRickLeft() {
        switch (this.rickIndex) {
            case 0:
                this.rickIndex = 3
                break
            case 1:
                this.rickIndex = 0
                break
            case 2:
                this.rickIndex = 3
                break
            case 3:
                this.rickIndex = 0
                break
        }
        this.paintRick()
    }

    private paintRick() {
        this.sprites.clear("rick")
        this.sprites.on("rick", this.rickIndex)
    }

    private createCinematicForLifeLost(
        name: "mortyTop" | "mortyBot",
        step: number
    ) {
        this.resetCinematic()
        this.addToCinematic(0, () => this.sprites.on(name, step))
        for (let loop = 0; loop < 4; loop++) {
            this.addToCinematic(300, () => {
                this.sprites.off(name, step)
                this.lifes--
            })
            this.addToCinematic(300, () => {
                this.sprites.on(name, step)
                this.lifes++
            })
        }
        this.addToCinematic(300, () => {
            this.sprites.off(name, step)
            this.resetMorties()
            this.lifes--
            if (this.lifes < 1) {
                this.createCinematicForGameOver()
            }
        })
    }

    private createCinematicForGameOver() {
        this.resetCinematic()
        for (let loop = 0; loop < 7; loop++) {
            this.addToCinematic(100, () => {
                this.sprites.on("gameOver")
            })
            this.addToCinematic(100, () => {
                this.sprites.off("gameOver")
            })
        }
        this.addToCinematic(100, () => {
            this.sprites.on("gameOver")
        })
        this.addToCinematic(3000, () => {
            this.sprites.on("gameOver")
            setHiScore(this.score)
            this.addToCinematic(300, () => {
                this.sprites.off("gameOver")
                document.location.reload()
            })
        })
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

    /**
     * Remove all the visible Morties and put them at the end of the tail.
     */
    private resetMorties() {
        const MAX_SCORE = 300
        const RADIUS = 10
        const maxIndex = WAVES.length - RADIUS
        const score = Math.min(MAX_SCORE, this.score)
        const index = Math.floor(
            Math.random() * RADIUS + (maxIndex * score) / MAX_SCORE
        )
        const [top, bot] = WAVES[index]
        this.mortyTopIndexes.splice(0)
        resetArray(this.mortyTopIndexes, top)
        resetArray(this.mortyBotIndexes, bot)
        console.log("Wave #", index)
    }
}

function resetArray(arr: number[], values: number[]) {
    arr.splice(0, arr.length, ...values)
}
