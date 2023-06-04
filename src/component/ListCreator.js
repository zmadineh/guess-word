import "../style/list-createor.css"

export default function ListCreator({title, children}) {

    return (
        <div>
            <h4>{title}</h4>
            <div className={"list"}>
                {children}
            </div>
        </div>
    );
}
