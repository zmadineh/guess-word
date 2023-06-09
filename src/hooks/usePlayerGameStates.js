import { useState } from 'react'

const usePlayerGameStates = (secret, setPlayerTurn) => {
    const [turn, setTurn] = useState(0)
    const [currentPlayerGuess, setCurrentPlayerGuess] = useState('')
    const [guesses, setGuesses] = useState([]) // each guess is an array
    const [history, setHistory] = useState([]) // each guess is a string
    const [isCorrect, setIsCorrect] = useState(false)

    const resetPlayerState = () => {
        setTurn(0)
        setCurrentPlayerGuess('')
        setGuesses([])
        setHistory([])
        setIsCorrect(false)
    }

    // format a guess into an array of letter objects
    // e.g. [{key: 'a', color: 'yellow'}]
    const formatGuess = () => {
        let secretArray = [...secret]
        let formattedGuess = [...currentPlayerGuess].map((l) => {
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
    const addNewGuess = (formattedGuess) => {
        if (currentPlayerGuess === secret) {
            setIsCorrect(true)
        }
        setGuesses(prevGuesses => {
            let newGuesses = [...prevGuesses]
            newGuesses[turn] = formattedGuess
            return newGuesses
        })
        setHistory(prevHistory => {
            return [...prevHistory, currentPlayerGuess]
        })
        setTurn(prevTurn => {
            return prevTurn + 1
        })
        setCurrentPlayerGuess('')
    }


    const handleSubmit = (event) => {

        event.preventDefault();

        // do not allow duplicate words
        if (history.includes(currentPlayerGuess)) {
            alert('you already tried that word.')
            return
        }
        // check word is 5 chars
        if (currentPlayerGuess.length !== 5) {
            alert('word must be 5 chars.')
            return
        }

        const formatted = formatGuess()
        addNewGuess(formatted)

        // change player turn
        setPlayerTurn(prev => !prev)
    }

    // when the player selects a key,
    // this function is executed to check if it is a letter of the alphabet
    const handleChange = ({ key }) => {

        if (key === "Backspace") {
            setCurrentPlayerGuess(prev => prev.slice(0, -1))
            return
        }
        if (/^[A-Za-z]$/.test(key)) {
            if (currentPlayerGuess.length < 5) {
                setCurrentPlayerGuess(prev => prev + key.toUpperCase())
            }
        }
    }

    return {currentPlayerGuess, history, guesses, isCorrect, handleChange, handleSubmit, resetPlayerState}
}

export default usePlayerGameStates;