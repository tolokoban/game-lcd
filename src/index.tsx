import * as React from "react"
import App from "./app"
import Data from "./data/data"
import DataContext from "./data/provider"
import { createRoot } from "react-dom/client"
import "./index.css"

async function start() {
    const container = document.getElementById("app")
    if (!container) throw Error(`No element with id "app"!`)

    const root = createRoot(container)
    root.render(
        <DataContext.Provider value={Data.getSingleton()}>
            <App />
        </DataContext.Provider>
    )
}

void start()
