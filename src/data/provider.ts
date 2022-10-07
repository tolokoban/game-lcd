import * as React from "react"
import Data from "./data"

const DataContext = React.createContext(Data.getSingleton())

export default DataContext
