
export default function InputForm({value, setValue, handleSubmit}) {

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Your guess:
                <input
                    type="text"
                    name="player-guess"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                />
            </label>
            <input type="submit" value="Submit" />
        </form>
    );
}

