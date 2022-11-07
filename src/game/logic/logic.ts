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

export default class Logic {
    public readonly sprites = makeSprites()
    public readonly eventScoreUpdate = new GenericEvent<number>()
    public readonly eventMiss = new GenericEvent<void>()

    private score = 0
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
        this.mortyTopIndexes = [-1]
        this.mortyBotIndexes = [rnd(-2, -7)]
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

    /**
     * @returns The number of simulataneous Morties per line.
     * This depends on the current score.
     */
    private getLevel() {
        const { score } = this
        if (score < 10) return 1
        if (score < 30) return 2
        return 3
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
        this.eventScoreUpdate.fire(this.score)
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
            mortyIndexes[k] = pos
            onMove(pos)
        }
        const inGameMortyIndexes = mortyIndexes.filter(
            (idx) => idx < MORTY_PATH_LENGTH
        )
        const level = this.getLevel()
        if (inGameMortyIndexes.length === level) return

        while (inGameMortyIndexes.length < level) {
            addMorty(inGameMortyIndexes)
        }
        mortyIndexes.splice(0, mortyIndexes.length, ...inGameMortyIndexes)
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

    private createCinematic(name: "mortyTop" | "mortyBot", step: number) {
        this.resetCinematic()
        this.addToCinematic(0, () => this.sprites.on(name, step))
        for (let loop = 0; loop < 4; loop++) {
            this.addToCinematic(300, () => this.sprites.off(name, step))
            this.addToCinematic(300, () => this.sprites.on(name, step))
        }
        this.addToCinematic(300, () => {
            this.sprites.off(name, step)
            this.resetMorties()
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
        this.resetMortyIndexes(this.mortyTopIndexes)
        this.resetMortyIndexes(this.mortyBotIndexes)
    }

    private resetMortyIndexes(mortyIndexes: number[]) {
        mortyIndexes.splice(0, mortyIndexes.length)
        for (let loop = 0; loop < 3; loop++) {
            addMorty(mortyIndexes)
        }
    }
}

function addMorty(mortyIndexes: number[]) {
    const lastMorty = Math.min(
        0,
        mortyIndexes.reduce(
            (acc, val) => Math.min(acc, val),
            Number.MAX_SAFE_INTEGER
        )
    )
    for (;;) {
        const pos = lastMorty - rnd(1, MORTY_PATH_LENGTH)
        if (mortyIndexes.includes(pos + 3)) continue

        mortyIndexes.push(pos)
        return
    }
}

function rnd(a: number, b: number): number {
    return a + Math.floor(Math.random() * (b - a))
}
