import './App.css';
import {useState, useEffect} from "react";
import {words} from "./data/words";
import InputForm from "./component/InputForm";

function App() {

    const [secret, setSecret] = useState(null)
    const [player, setPlayer] = useState('human') // human or bot
    const [playerGuess, setPlayerGuess] = useState('')



    useEffect(() => {
        const randomSecret = words[Math.floor(Math.random() * words.length)]
        setSecret(randomSecret)
    }, [setSecret])

    const handleSubmit = (event) => {
        event.preventDefault();
        alert(`The guess you entered was: ${playerGuess}`)
    }

    return (
        <div className="App">
            <h1>miley challenge</h1>
            {secret && <div>Secret is: {secret}</div>}
            <div>Turn is: {player}</div>
            <div>player guess is: {playerGuess}</div>
            <div>
                <InputForm value={playerGuess} setValue={setPlayerGuess} handleSubmit={handleSubmit}/>
            </div>
        </div>
    );
}

export default App;
