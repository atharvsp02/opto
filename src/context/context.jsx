import { createContext, useState } from "react";

export const Context = createContext();


const ContextProvider = (props) => {

    const [showData, setShowData] = useState("all");




    const contextValue = {
        showData,
        setShowData
    }

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    )
}

export default ContextProvider;