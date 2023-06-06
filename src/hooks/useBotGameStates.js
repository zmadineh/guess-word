import { useState } from 'react'
import {words} from "../data/words";
import {letterFrequency} from "../data/letterFrequency";

const useBotGameStates = (secret, playerTurn, setPlayerTurn, strLen, mode) => {
    const [turn, setTurn] = useState(0)
    const [currentBotGuess, setCurrentBotGuess] = useState('')
    const [botGuesses, setBotGuesses] = useState([]) // each guess is an array
    const [botIsCorrect, setBotIsCorrect] = useState(false)

    // store words that the bot can choose
    const [validWords, setValidWords] = useState(words)

    // save all letters that are in the secret and have correct position
    const [correctLetters, setCorrectLetters] = useState([])

    // save all letters that are not in the secret
    const [incorrectLetters, setIncorrectLetters] = useState([])

    // save all letters that are in the secret and not in correct position
    const [incorrectPos, setIncorrectPos] = useState([])

    // for each position, save the correct letter
    // and the letter that are in the secret but not in correct position were chosen
    // for this position in the previous guesses
    const [letterHistory, setLetterHistory] = useState(Array.apply(null, Array(strLen)).map(l => {
        return {correct: null, incorrectPos: []}
    }))

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

        // format a guess into an array of letter objects
        // e.g. [{key: 'a', color: 'yellow'}]
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


        // Letters are separated into three categories:
        // 1) correct letters and correct position -> correctLetters array
        // 2) correct letters and incorrect position -> incorrectPos array
        // 3) incorrect letters -> incorrectLetters array
        const tempArray = letterHistory
        let tempCorrectLetters = [...correctLetters]
        let tempIncorrectPos = [...incorrectPos]
        let tempIncorrectLetters = [...incorrectLetters]

        // fill letterHistory and three categories of letters (correctLetters, incorrectPos, incorrectLetters)
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

        // remove the letters that are common in correctLetters or incorrectPos and incorrectLetters from incorrectLetters,
        // for words that have the same two letters
        tempIncorrectLetters = tempIncorrectLetters.filter(l => !tempCorrectLetters.includes(l) && !tempIncorrectPos.includes(l))

        setLetterHistory(tempArray)
        // use set to have an array of unique letters
        setCorrectLetters([...new Set(tempCorrectLetters)])
        setIncorrectPos([...new Set(tempIncorrectPos)])
        setIncorrectLetters([...new Set(tempIncorrectLetters)])
    }


    // add a new guess to the guesses state
    // update the botIsCorrect state if the guess is correct
    const addNewGuess = (guess) => {
        if (guess === secret) {
            setBotIsCorrect(true)
        }

        setBotGuesses(prevGuesses => {
            setCurrentBotGuess(guess)
            return [...prevGuesses, guess]
        })
      }


    // generate a new guess
    const createGuess = () => {

        // before generating a new guess,
        // the results of the previous guess are used to generate a new set of valid words
        let newWords = []
        if(mode === 'easy')
            newWords = validWords.filter(word => !botGuesses.includes(word) && easyWordTest(word, letterHistory, incorrectLetters, incorrectPos))
        else if(mode === 'medium')
            newWords = validWords.filter(word => !botGuesses.includes(word) && mediumWordTest(word, letterHistory, incorrectLetters, incorrectPos))
        else newWords = hardWordTest(validWords, letterHistory, incorrectLetters, incorrectPos).map(item => { return item.w })

        setValidWords(newWords)

        // for easy and medium mode, choose a new guess from new valid words
        // for hard mode, choose a word from the first 5 words of new valid words randomly
        let newGuess = ''
        if(mode === 'easy')
            newGuess = newWords[Math.floor(Math.random() * newWords.length)]
        else if(mode === 'medium')
            newGuess = newWords[Math.floor(Math.random() * newWords.length)]
        else{
            let temp = newWords.slice(0, (newWords.length > 5 ? 5 : newWords.length))
            newGuess = temp[Math.floor(Math.random() * temp.length)]
        }

        setCurrentBotGuess(newGuess)

        formatGuess(newGuess)
        addNewGuess(newGuess)

        // change player turn
        setPlayerTurn(!playerTurn)
    }


    // remove words that do not have green letters from the valid words
    const easyWordTest = (word, letterHistory, incorrectLetters) => {
        let pass = true
        let wordArray = word.split('')

        for(let i=0; i < wordArray.length; ++i)
            if (letterHistory[i].correct !== null && wordArray[i] !== letterHistory[i].correct) { // green test
                pass = false
                return
            }

        return pass
    }

    // remove words that do not have green letters (letters that is in secret),
    // remove words that have grey letters (letters that not in secret),
    // remove the words where the letters are repeated in the wrong place
    // from the valid words
    const mediumWordTest = (word, letterHistory, incorrectLetters, incorrectPos) => {

        let pass = true
        let wordArray = word.split('')

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


    // in addition to the words that were deleted in the mediumWordTest function,
    // the words that do not have yellow letters are also deleted (yellow letters: letters that is in secret but not in correct position),
    const preHardTest = (word, letterHistory, incorrectLetters, incorrectPos) => {

        let pass = true
        let wordArray = word.split('')

        incorrectPos.forEach(l => {
            if(!wordArray.includes(l)){
                pass = false
            }
        })

        return pass && mediumWordTest(word, letterHistory, incorrectLetters, incorrectPos)
    }


    // find words that have the most frequent letters and sort them in descending order and assign to valid words state
    // then to generate new guess choose a word from the first 5 words of new valid words randomly (in create guess function)
    const hardWordTest = (validWords, letterHistory, incorrectLetters, incorrectPos) => {

        let filteredWords = validWords.filter(word => !botGuesses.includes(word) && preHardTest(word, letterHistory, incorrectLetters, incorrectPos))

        let frequencyArray = filteredWords.map(word => {
            let frequencySum = 0
            word.split('').forEach(letter => {
                frequencySum += letterFrequency.find(item => item.key === letter).p
            })
            return {w: word, p: frequencySum}
        })
        return frequencyArray.sort((word1, word2) => (word2.p - word1.p));
    }

    return {turn, botGuesses, botIsCorrect, createGuess, resetBotState}
}

export default useBotGameStates;