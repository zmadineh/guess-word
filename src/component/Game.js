import {useState, useEffect} from "react";
import InputForm from "./InputForm";
import useBotGameStates from "../hooks/useBotGameStates";
import usePlayerGameStates from "../hooks/usePlayerGameStates";

export default function Game({secret}) {

    const [playerTurn, setPlayerTurn] = useState(true) // true human or false bot
    const { currentPlayerGuess, history, guesses, handleChange, handleSubmit } = usePlayerGameStates(secret, setPlayerTurn)
    const { currentBotGuess, botHistory, botGuesses, createGuess } = useBotGameStates(secret, playerTurn, setPlayerTurn)

    useEffect(() => {
        if(!playerTurn)
            createGuess()
    }, [playerTurn])

    return (
        <div>
            <h1>miley challenge</h1>
            {secret && <div>Secret is: {secret}</div>}
            <div>Turn is: {playerTurn ? 'human' : 'bot'}</div>
            <div>player guess is: {currentPlayerGuess}</div>
            <div>Bot guess is: {currentBotGuess}</div>
            <div>
                <InputForm value={currentPlayerGuess} handleChange={handleChange} handleSubmit={handleSubmit} enable={playerTurn}/>
            </div>
            <div>
                <ul>
                    {
                        guesses.map((item, index) => (
                            <li key={index}>
                                {item.map((letter) => (
                                    <span style={{color: letter.color}}>{letter.key}</span>
                                ))}
                            </li>
                        ))
                    }
                </ul>
            </div>

            <div>
                <ul>
                    {
                        botHistory.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))
                    }
                </ul>
            </div>
        </div>
    );
}