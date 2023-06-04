import './App.css';
import {words} from "./data/words";

import {useState, useEffect} from "react";
import Game from "./component/Game";

function App() {

    const [secret, setSecret] = useState(null)
    const strLen = 5

    const resetSecret = () => {
        const randomSecret = words[Math.floor(Math.random() * words.length)]
        setSecret(randomSecret)
    }

    useEffect(() => {
        resetSecret()
    }, [setSecret])

    return (
        <div className={"main-container"}>
            <Game secret={secret} resetSecret={resetSecret} strLen={strLen}/>
        </div>
    );
}

export default App;
