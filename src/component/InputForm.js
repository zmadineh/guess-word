
export default function InputForm({value, handleChange, handleSubmit, enable}) {

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Your guess:
                <input
                    type="text"
                    name="player-guess"
                    value={value}
                    onKeyDown={handleChange}
                    disabled={!enable}
                />
            </label>
            <input type="submit" value="Submit" disabled={!enable}/>
        </form>
    );
}

