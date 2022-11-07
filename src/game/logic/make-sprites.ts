import Painter from "../painter"
import Sprites from "../sprites"

export function makeSprites() {
    return new Sprites({
        rickTopLeft: [Painter.RICK_TOP_LEFT],
        rickTopRight: [Painter.RICK_TOP_RIGHT],
        rickBotLeft: [Painter.RICK_BOTTOM_LEFT],
        rickBotRight: [Painter.RICK_BOTTOM_RIGHT],
        rick: [
            Painter.RICK_TOP_LEFT,
            Painter.RICK_TOP_RIGHT,
            Painter.RICK_BOTTOM_RIGHT,
            Painter.RICK_BOTTOM_LEFT,
        ],
        mortyTop: [
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
        ],
        mortyBot: [
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
        ],
        lifes: [Painter.LIFE_1, Painter.LIFE_2, Painter.LIFE_3],
        life1: [Painter.LIFE_1],
        life2: [Painter.LIFE_2],
        life3: [Painter.LIFE_3],
    })
}
