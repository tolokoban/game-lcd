import React from "react"

interface Wave {
    score: number
    top: number[]
    bot: number[]
}

export default function Wave() {
    const [waves, setWaves] = React.useState<Wave[]>([])
    React.useEffect(() => {
        if (waves.length > 2000) return

        const wave = createRandomWave()
        if (wave.score < 0) {
            setWaves([...waves])
            return
        }
        const newWaves = [...waves, wave]
        newWaves.sort((a, b) => {
            const A = a.score
            const B = b.score
            return A - B
        })
        setWaves([...newWaves])
    }, [waves])
    return (
        <pre
            style={{
                height: "90%",
                overflow: "auto",
            }}
        >
            {waves.map(
                (wave) =>
                    `[[${wave.top
                        .map((v) => (v < -9 ? `${v}` : ` ${v}`))
                        .join(",")}], [${wave.bot
                        .map((v) => (v < -9 ? `${v}` : ` ${v}`))
                        .join(",")}]],    // Score = ${Math.round(
                        wave.score
                    )}\n`
            )}
        </pre>
    )
}

function createRandomWave(): Wave {
    let top = dice(15)
    let bot = dice(15)
    const wave: Wave = {
        score: 0,
        top: [top],
        bot: [bot],
    }
    for (let count = 0; count < 4; count++) {
        top += dice(15)
        wave.top.push(top)
    }
    for (let count = 0; count < 4; count++) {
        bot += dice(15)
        wave.bot.push(bot)
    }
    const maxTop = wave.top.reduce((prv, cur) => Math.max(prv, cur), 0) + 1
    const maxBot = wave.bot.reduce((prv, cur) => Math.max(prv, cur), 0) + 1
    const max = Math.max(maxTop, maxBot)
    wave.top.forEach((val, idx, arr) => {
        arr[idx] = val - max
    })
    wave.bot.forEach((val, idx, arr) => {
        arr[idx] = val - max
    })
    computeScore(wave)
    return wave
}

function dice(a: number): number {
    return Math.floor(Math.random() * a) + 1
}

function computeScore(wave: Wave) {
    let top = [...wave.top]
    let bot = [...wave.bot]
    const falls: number[] = []
    const ricks: number[] = []
    for (let time = 0; time < 10000; time++) {
        let stop = true
        let count = 0
        if ((time & 1) === 0) {
            top = top.map((v) => v + 1)
            for (const val of top) {
                if (val < 10) stop = false
                if (val === 3 || val === 6) {
                    count++
                    falls.push(time)
                    ricks.push(val === 3 ? 0 : 1)
                }
            }
        } else {
            bot = bot.map((v) => v + 1)
            for (const val of bot) {
                if (val < 10) stop = false
                if (val === 3 || val === 6) {
                    count++
                    falls.push(time)
                    ricks.push(val === 3 ? 2 : 3)
                }
            }
        }
        if (count > 1) {
            // Double fall is impossible to catch.
            wave.score = -1
            return
        }
        if (stop) break
    }
    for (let i = 1; i < falls.length; i++) {
        const deltaTime = falls[i] - falls[i - 1]
        let deltaRick = Math.abs(ricks[i] - ricks[i - 1])
        if (deltaRick === 3) deltaRick = 1
        const score = (deltaRick * 1000) / (deltaTime * deltaTime)
        wave.score += score
    }
}
