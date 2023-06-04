import { useState } from 'react'
import {words} from "../data/words";
import {queries} from "@testing-library/react";
import {letterPossibility} from "../data/letterPossibility";

const useBotGameStates = (secret, playerTurn, setPlayerTurn, strLen, mode) => {
    const [turn, setTurn] = useState(0)
    const [currentBotGuess, setCurrentBotGuess] = useState('')
    const [botGuesses, setBotGuesses] = useState([]) // each guess is an array
    const [letterHistory, setLetterHistory] = useState(Array.apply(null, Array(strLen)).map(l => {
        return {correct: null, incorrectPos: []}
    }))
    const [correctLetters, setCorrectLetters] = useState([])
    const [incorrectLetters, setIncorrectLetters] = useState([])
    const [incorrectPos, setIncorrectPos] = useState([])
    const [botIsCorrect, setBotIsCorrect] = useState(false)
    const [validWords, setValidWords] = useState(words)

    const resetBotState = (newSecret) => {
        setBotGuesses([])
        setBotIsCorrect(false)
        setValidWords(words)
        setIncorrectLetters([])
        setIncorrectPos([])
        setCorrectLetters([])
        setLetterHistory(Array.apply(null, Array(strLen)).map(l => {
            return {correct: null, incorrectPos: []}
        }))
    }

    const formatGuess = (guess) => {

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

        const tempArray = letterHistory
        let tempCorrectLetters = [...correctLetters]
        let tempIncorrectPos = [...incorrectPos]
        let tempIncorrectLetters = [...incorrectLetters]

        formattedGuess.forEach((l, i) => {
            if(l.color === 'green') {
                tempArray[i].correct = l.key
                tempCorrectLetters.push(l.key)
            }
            else if(l.color === 'yellow'){
                tempArray[i].incorrectPos.push(l.key)
                tempIncorrectPos.push(l.key)
            }
            else
                tempIncorrectLetters.push(l.key)
        })

        tempIncorrectLetters = tempIncorrectLetters.filter(l => !tempCorrectLetters.includes(l) && !tempIncorrectPos.includes(l))

        setLetterHistory(tempArray)
        setCorrectLetters([...new Set(tempCorrectLetters)])
        setIncorrectPos([...new Set(tempIncorrectPos)])
        setIncorrectLetters([...new Set(tempIncorrectLetters)])

        return tempArray
    }


    const addNewGuess = (guess) => {
        if (guess === secret) {
            setBotIsCorrect(true)
        }

        setBotGuesses(prevGuesses => {
            setCurrentBotGuess(guess)
            return [...prevGuesses, guess]
        })
      }


    // add the new guess
    const createGuess = () => {

        let newWords = []
        if(mode === 'easy')
            newWords = validWords.filter(word => !botGuesses.includes(word) && easyWordTest(word, letterHistory, incorrectLetters, incorrectPos))
        else if(mode === 'avg')
            newWords = validWords.filter(word => !botGuesses.includes(word) && avgWordTest(word, letterHistory, incorrectLetters, incorrectPos))
        else newWords = hardWordTest(letterHistory, incorrectLetters, incorrectPos).map(item => { return item.w })

        setValidWords(newWords)

        let newGuess = ''
        if(mode === 'easy')
            newGuess = newWords[Math.floor(Math.random() * newWords.length)]
        else if(mode === 'avg')
            newGuess = newWords[Math.floor(Math.random() * newWords.length)]
        else{
            let temp = newWords.slice(0, (newWords.length > 10 ? 10 : newWords.length))
            newGuess = temp[Math.floor(Math.random() * temp.length)]
        }

        setCurrentBotGuess(newGuess)

        formatGuess(newGuess)
        addNewGuess(newGuess)

        // change player turn
        setPlayerTurn(!playerTurn)
    }


    const easyWordTest = (word, letterHistory, incorrectLetters) => {
        let pass = true
        let wordArray = word.split('')

        for(let i=0; i < wordArray.length; ++i)
            if (letterHistory[i].correct !== null && wordArray[i] !== letterHistory[i].correct) { // green test
                pass = false
                return
            }
        // else if (incorrectLetters.includes(wordArray[i])) { // grey test
        //         pass = false
        //         return
        //     }
        //      else
        //         pass = !letterHistory[i].incorrectPos.includes(wordArray[i]) // yellow test

        return pass
    }

    const avgWordTest = (word, letterHistory, incorrectLetters, incorrectPos) => {

        let pass = true
        let wordArray = word.split('')

        incorrectPos.forEach(l => {
            if(!wordArray.includes(l)){
                pass = false
                return
            }
        })

       if(pass)
            for(let i=0; i < wordArray.length; ++i)
                if (letterHistory[i].correct !== null && wordArray[i] !== letterHistory[i].correct) { // green test
                    pass = false
                    return
                }
                else if (incorrectLetters.includes(wordArray[i])) { // grey test
                     pass = false
                     return
                }
                else
                    pass = !letterHistory[i].incorrectPos.includes(wordArray[i]) // yellow test
        return pass
    }

    const hardWordTest = ( letterHistory, incorrectLetters, incorrectPos) => {

        const lettersPossibility = letterPossibility
        let filteredWords = validWords.filter(word => !botGuesses.includes(word) && avgWordTest(word, letterHistory, incorrectLetters, incorrectPos))

        let possibilityArray = []
        filteredWords.map(word => {
            let wordP = 0
            word.split('').forEach(letter => {
                wordP += lettersPossibility.find(item => item.key === letter).p
            })
            possibilityArray.push({w: word, p: wordP})
        })
        return possibilityArray.sort((word1, word2) => (word2.p - word1.p));
    }

    return {turn, botGuesses, botIsCorrect, createGuess, resetBotState}
}

export default useBotGameStates;