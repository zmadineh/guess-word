import { useState } from 'react'
import {words} from "../data/words";

const useBotGameStates = (secret, playerTurn, setPlayerTurn) => {
    const [turn, setTurn] = useState(0)
    const [currentBotGuess, setCurrentBotGuess] = useState('')
    const [botGuesses, setBotGuesses] = useState([]) // each guess is an array
    const [botHistory, setBotHistory] = useState([]) // each guess is a string
    const [botIsCorrect, setBotIsCorrect] = useState(false)

    // format a guess into an array of letter objects
    // e.g. [{key: 'a', color: 'yellow'}]
    const formatGuess = (guess) => {
        console.log('current bot guess : ', guess)

        let secretArray = [...secret]
        let formattedGuess = [...guess].map((l) => {
            return {key: l, color: 'grey'}
        })

        // find any green letters
        formattedGuess.forEach((l, i) => {
            if (secret[i] === l.key) {
                formattedGuess[i].color = 'green'
                secretArray[i] = null
            }
        })

        // find any yellow letters
        formattedGuess.forEach((l, i) => {
            if (secretArray.includes(l.key) && l.color !== 'green') {
                formattedGuess[i].color = 'yellow'
                secretArray[secretArray.indexOf(l.key)] = null
            }
        })

        return formattedGuess
    }

    // add a new guess to the guesses state
    // update the isCorrect state if the guess is correct
    // add one to the turn state
    const addNewGuess = (formattedGuess, guess) => {
        if (currentBotGuess === secret) {
            setBotIsCorrect(true)
        }
        setBotGuesses(prevGuesses => {
            let newGuesses = [...prevGuesses]
            setCurrentBotGuess[turn] = formattedGuess
            return newGuesses
        })
        setBotHistory(prevHistory => {
            return [...prevHistory, guess]
        })
        setTurn(prevTurn => {
            return prevTurn + 1
        })
        setCurrentBotGuess('')
    }

    const submitGuess = () => {

    }

    // handle keyup event & track current guess
    // if user presses enter, add the new guess
    const createGuess = () => {
        // create bot guess
        const randomGuess = words[Math.floor(Math.random() * words.length)]
        setCurrentBotGuess(randomGuess)
        console.log(" bot: " , randomGuess)

        const formatted = formatGuess(randomGuess)
        addNewGuess(formatted, randomGuess)
        console.log("bot guess: ", formatted)

        // change player turn
        setPlayerTurn(prev => !prev)


        // submitGuess();
    }

    return {turn, currentBotGuess, botHistory, botGuesses, botIsCorrect, createGuess}
}

export default useBotGameStates;