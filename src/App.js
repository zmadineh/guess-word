import './App.css';
import {words} from "./data/words";

import {useState, useEffect} from "react";
import Game from "./component/Game";

function App() {

    const [secret, setSecret] = useState(null)

    useEffect(() => {
        const randomSecret = words[Math.floor(Math.random() * words.length)]
        setSecret(randomSecret)
    }, [setSecret])

    return (
        <div className="App">
            <Game secret={secret} />
        </div>
    );
}

export default App;
