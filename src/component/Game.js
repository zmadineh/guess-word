import {useState, useEffect} from "react";
import InputForm from "./InputForm";
import useBotGameStates from "../hooks/useBotGameStates";
import usePlayerGameStates from "../hooks/usePlayerGameStates";

export default function Game({secret, resetSecret, strLen}) {

    const [playerTurn, setPlayerTurn] = useState(true) // true human or false bot
    const [stop, setStop] = useState(false)
    const [mode, setMode] = useState('avg')
    const [selectedValue, setSelectedValue] = useState()
    const { currentPlayerGuess, isCorrect, guesses, handleChange, handleSubmit, resetPlayerState } = usePlayerGameStates(secret, setPlayerTurn)
    const { botIsCorrect, botGuesses, createGuess, resetBotState } = useBotGameStates(secret, playerTurn, setPlayerTurn, strLen, mode)

    const resetGame = () => {
        resetSecret()
        setPlayerTurn(true)
        resetPlayerState()
        resetBotState()
        setStop(false)
        setMode('easy')
    }

    useEffect(() => {
        if(isCorrect){
            alert("player win!")
            setStop(true)
        }
        else if(botIsCorrect){
            alert("bot win!")
            setStop(true)
        }
        else if(!playerTurn)
            setTimeout(() => {
                createGuess()
            }, 200);
    }, [playerTurn, isCorrect, botIsCorrect])

    const modeHandleChange = (e) => {
        setMode(e.target.value)
    }

    return (
        <div>
            <h1>miley challenge</h1>
            {secret && <div>Secret is: {stop ? secret : "*****"}</div>}
            <div>
                <button onClick={resetGame}>new game</button>
            </div>
            <div>
                <br/>
                <input type='radio' name='mode' id='easy-selector' value='easy' checked={mode === 'easy'}
                       onChange={modeHandleChange}/>
                <label htmlFor="easy-selector">easy</label>
                <br/>
                <input type='radio' name='mode' id='avg-selector' value='avg' checked={mode === 'avg'}
                       onChange={modeHandleChange}/>
                <label htmlFor="avg-selector">avg</label>

                <input type='radio' name='mode' id='hard-selector' value='hard' checked={mode === 'hard'}
                       onChange={modeHandleChange}/>
                <label htmlFor="hard-selector">hard</label>

                <div>
                    {mode}
                </div>
            </div>
            <div>Turn is: {playerTurn ? 'human' : 'bot'}</div>
            <div>
                <InputForm value={currentPlayerGuess} handleChange={handleChange} handleSubmit={handleSubmit} enable={playerTurn && !isCorrect && !botIsCorrect}/>
            </div>

            <div style={{display: "flex", justifyContent: "space-around"}}>
                <div>
                    <h4>player guess</h4>
                    <ul>
                        {
                            guesses.map((item, index) => (
                                <li key={index} style={{listStyleType: "none"}}>
                                    {item.map((letter) => (
                                        <span style={{color: letter.color}}>{letter.key}</span>
                                    ))}
                                </li>
                            ))
                        }
                    </ul>
                </div>

                <div>
                    <h4>robot guess</h4>
                    <ul>
                        {
                            botGuesses.map((item, index) => (
                                <li key={index} style={{listStyleType: "none", color: (item === secret ? 'green' : "black") }}>
                                    {item}
                                </li>
                            ))
                        }
                    </ul>
                </div>
            </div>
        </div>
    );
}