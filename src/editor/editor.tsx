import App from "./app"
import Data from "./data/data"
import DataContext from "./data/provider"

export default function Editor() {
    return (
        <DataContext.Provider value={Data.getSingleton()}>
            <App />
        </DataContext.Provider>
    )
}
