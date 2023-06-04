import { useState } from 'react'
import {words} from "../data/words";
import {queries} from "@testing-library/react";

const useBotGameStates = (secret, playerTurn, setPlayerTurn, strLen, mode) => {
    const [turn, setTurn] = useState(0)
    const [currentBotGuess, setCurrentBotGuess] = useState('')
    const [botGuesses, setBotGuesses] = useState([]) // each guess is an array
    const [botHistory, setBotHistory] = useState([]) // each guess is a string
    const [letterHistory, setLetterHistory] = useState(Array.apply(null, Array(strLen)).map(l => {
        return {correct: null, incorrectPos: []}
    }))
    const [correctLetters, setCorrectLetters] = useState([])
    const [incorrectLetters, setIncorrectLetters] = useState([])
    const [incorrectPos, setIncorrectPos] = useState([])
    const [botIsCorrect, setBotIsCorrect] = useState(false)
    const [validWords, setValidWords] = useState(words)

    const resetBotState = (newSecret) => {
        setTurn(0)
        setBotGuesses([])
        setBotHistory([])
        setBotIsCorrect(false)
        setValidWords(words)
        setIncorrectLetters([])
        setIncorrectPos([])
        setCorrectLetters([])
        setLetterHistory(Array.apply(null, Array(strLen)).map(l => {
            return {correct: null, incorrectPos: []}
        }))
    }

    // format a guess into an array of letter objects
    // e.g. [{key: 'a', color: 'yellow'}]
    const formatGuess = (guess) => {
        console.log('current bot guess : ', currentBotGuess)

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
            else if(!tempCorrectLetters.includes(l.key) && !tempIncorrectPos.includes(l.key))
                tempIncorrectLetters.push(l.key)

            console.log('formatted: ', tempIncorrectLetters, tempIncorrectPos, tempArray[i].correct)
        })

        setLetterHistory(tempArray)
        setCorrectLetters([...new Set(tempCorrectLetters)])
        setIncorrectPos([...new Set(tempIncorrectPos)])
        setIncorrectLetters([...new Set(tempIncorrectLetters)])

        return tempArray
    }


    const addNewGuess = (guess) => {
        console.log('compare bot guess: ', guess, 'current', currentBotGuess, 'secret', secret)
        if (guess === secret) {
            console.log('compare bot guess: ', guess, currentBotGuess, secret)
            setBotIsCorrect(true)
        }

        setBotHistory(prevHistory => {
            return [...prevHistory, guess]
        })

        setBotGuesses(prevGuesses => {
            setCurrentBotGuess(guess)
            return [...prevGuesses, guess]
        })

        setTurn(prevTurn => {
            return prevTurn + 1
        })
        // setCurrentBotGuess('')
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
        console.log('new words: ' , newWords)


        let newGuess = ''
        if(mode === 'easy')
            newGuess = newWords[Math.floor(Math.random() * newWords.length)]
        else if(mode === 'avg')
            newGuess = newWords[Math.floor(Math.random() * newWords.length)]
        else
            newGuess = newWords[0]



        setCurrentBotGuess(newGuess)
        console.log('bot guess: ', newGuess, currentBotGuess)

        const lHistory = formatGuess(newGuess)
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
                    console.log('incorrect : ', wordArray[i])
                     pass = false
                     return
                }
                else
                    pass = !letterHistory[i].incorrectPos.includes(wordArray[i]) // yellow test

        console.log('avg test: ', word, pass, incorrectLetters)
        return pass
    }

    const hardWordTest = ( letterHistory, incorrectLetters, incorrectPos) => {
        const letterPossibility =
            [
                {key: 'A', p: 	8.4966},
                {key: 'B', p: 	2.0720},
                {key: 'C', p: 	4.5388},
                {key: 'D', p: 	3.3844},
                {key: 'E', p: 	11.1607},
                {key: 'F', p: 	1.8121},
                {key: 'G', p: 	2.4705},
                {key: 'H', p: 	3.0034},
                {key: 'I', p: 	7.5448},
                {key: 'J', p: 	0.1965},
                {key: 'K', p: 	1.1016},
                {key: 'L', p: 	5.4893},
                {key: 'M', p: 	3.01296},
                {key: 'N', p: 	6.6544},
                {key: 'O', p: 	7.1635},
                {key: 'P', p: 	3.1671},
                {key: 'Q', p: 	0.1962},
                {key: 'R', p: 	7.5809},
                {key: 'S', p: 	5.7351},
                {key: 'T', p: 	6.9509},
                {key: 'U', p: 	3.6308},
                {key: 'V', p: 	1.0074},
                {key: 'W', p: 	1.2899},
                {key: 'X', p: 	0.2902},
                {key: 'Y', p: 	1.7779},
                {key: 'Z', p: 	0.2722},
            ]

        let pass = true

        let filteredWords = validWords.filter(word => !botHistory.includes(word) && avgWordTest(word, letterHistory, incorrectLetters, incorrectPos))

        console.log('hard test filteredWords: ', filteredWords)

        let possibilityArray = []

        filteredWords.map(word => {
            let wordP = 0
            word.split('').forEach(letter => {
                wordP += letterPossibility.find(item => item.key === letter).p
            })
            possibilityArray.push({w: word, p: wordP})
        })

        // console.log('hard test possibility: ', possibilityArray)

        let sortedPossibility = possibilityArray.sort((word1, word2) => (word2.p - word1.p));

        console.log('hard test sorted: ', sortedPossibility, sortedPossibility[0])

        return sortedPossibility
    }

    return {turn, botHistory, botGuesses, botIsCorrect, createGuess, resetBotState}
}

export default useBotGameStates;