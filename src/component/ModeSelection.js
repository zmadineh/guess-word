export default function ModeSelection ({mode, handleChange}) {

    return (
        <div style={{display: "flex", flexDirection: "column"}}>
            <div>
                <input type='radio' name='mode' id='easy-selector' value='easy' checked={mode === 'easy'}
                       onChange={handleChange}/>
                <label htmlFor="easy-selector">easy</label>
            </div>

            <div>
                <input type='radio' name='mode' id='medium-selector' value='medium' checked={mode === 'medium'}
                       onChange={handleChange}/>
                <label htmlFor="medium-selector">medium</label>
            </div>

            <div>
                <input type='radio' name='mode' id='hard-selector' value='hard' checked={mode === 'hard'}
                       onChange={handleChange}/>
                <label htmlFor="hard-selector">hard</label>
            </div>
        </div>
    )
}