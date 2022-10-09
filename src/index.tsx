import * as React from "react"
import App from "./app"
import Data from "./data/data"
import DataContext from "./data/provider"
import { createRoot } from "react-dom/client"
import { Game } from "./game/game"
import "./index.css"

async function start() {
    const container = document.getElementById("app")
    if (!container) throw Error(`No element with id "app"!`)

    const root = createRoot(container)
    root.render(
        <DataContext.Provider value={Data.getSingleton()}>
            <Main />
        </DataContext.Provider>
    )
}

function Main() {
    console.log("🚀 [index] window.location.hash = ", window.location.hash) // @FIXME: Remove this line written on 2022-10-09 at 13:03
    if (window.location.hash === "#edit") return <App />
    return <Game />
}

void start()
