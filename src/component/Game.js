import {useState, useEffect} from "react";
import InputForm from "./InputForm";
import useBotGameStates from "../hooks/useBotGameStates";
import usePlayerGameStates from "../hooks/usePlayerGameStates";
import ListCreator from "./ListCreator";
import ModeSelection from "./ModeSelection";

import '../style/game.css';

export default function Game({secret, resetSecret, strLen}) {

    const [playerTurn, setPlayerTurn] = useState(true) // true human or false bot
    const [stop, setStop] = useState(false)
    const [mode, setMode] = useState('medium')
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
        <div className={"container"}>

            <h1 className={"main-header"}>miley challenge</h1>
            <button className={"reset-btn , btn"} onClick={resetGame}>new game</button>

            <div className={"setting-container"}>
                <div className={"setting-column"}>
                    {secret && <h4>Secret is : {stop ? secret : "_ _ _ _ _"}</h4>}
                    <div>Turn is : <span style={{fontSize: "17px", fontWeight: "bold"}}>{playerTurn ? 'you' : 'bot'}</span></div>
                </div>
                <div className={"setting-column"}>
                    <ModeSelection
                        mode={mode}
                        handleChange={modeHandleChange}
                    />
                </div>
            </div>

            <div className={"input-container"}>
                <InputForm
                    value={currentPlayerGuess}
                    handleChange={handleChange}
                    handleSubmit={handleSubmit}
                    enable={playerTurn && !isCorrect && !botIsCorrect}/>
            </div>

            <div className={"list-container"}>
                <ListCreator title={'Player guess'}>
                    {
                        guesses.map((item, index) => (
                            <div key={index} className={"list-item"}>
                                {item.map((letter) => (
                                    <span style={{color: letter.color}}>
                                        {letter.key}
                                    </span>
                                ))}
                            </div>
                        ))
                    }
                </ListCreator>
                <ListCreator title={'Robot guess'}>
                        {
                            botGuesses.map((item, index) => (
                                <div key={index} className={"list-item"}>
                                    <span style={{color: (item === secret ? 'green' : "#ececec")}}>
                                        {item}
                                    </span>
                                </div>
                            ))
                        }
                </ListCreator>
            </div>
        </div>
    );
}