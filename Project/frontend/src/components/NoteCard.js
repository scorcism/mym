

const NoteCard = (n) => {
    n =  n.n
    let URL = `http://localhost:5000`;

    const deleteNote = async () => {
        // console.log(n._id + " id")
        let id = n._id
        let respo = await deleteNoteData(`${URL}/deletenote`, { id })
        if (respo.success) {
            // removeFromIDB(id);
            alert(respo.message);
            // getuserNotes();
        } else {
            alert(respo.message)
        }
    }
    const deleteNoteData = async (url = "", data = {}) => {
        const response = await fetch(url, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem("user")
            },
            body: JSON.stringify(data),
        });
        return response.json(); // parses JSON response into native JavaScript objects
    }

    return (
        <>
            <div className="card mx-2 my-2" style={{ width: "18rem" }}>
                <div className="card-body">
                    <h5 className="card-title">{n.title}</h5>
                    <h6 className="card-subtitle mb-2 text-danger">{n.type}</h6>
                    <p className="card-text">{n.desc}</p>
                    <p className="text-danger" onClick={deleteNote} style={{ textDecoration: "underline", cursor: "pointer" }}>delete</p>
                </div>
            </div>


        </>
    )
}

export default NoteCard;