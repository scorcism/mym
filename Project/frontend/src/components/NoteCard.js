
let db;
let dbReq = indexedDB.open('myDatabase', 1);

dbReq.onupgradeneeded = function (event) {

    // Create an object store named notes. Object stores
    // in databases are where data are stored.
    db = event.target.result;

    // Create the notes object store, or retrieve that store if it
    // already exists.
    let notes;
    if (!db.objectStoreNames.contains('notes')) {
        notes = db.createObjectStore('notes', { autoIncrement: false });
    } else {
        notes = dbReq.transaction.objectStore('notes');
    }

    // If there isn't already a timestamp index in our notes object
    // store, make one so we can query notes by their timestamps
    // if (!notes.indexNames.contains('timestamp')) {
    //     notes.createIndex('timestamp', 'timestamp');
    // }
}
dbReq.onerror = function (event) {
    alert('error opening database ' + event.target.errorCode);
}

dbReq.onsuccess = function (event) {
    db = event.target.result;
    // Once the database is ready, display the notes we already have!
    // getAndDisplayNotes(db);
}
const removeFromIDB = (id) => {
    try {
        let transaction = db.transaction(["notes"], "readwrite");
        let request = transaction.objectStore("notes").delete(id);
    } catch (error) {
        alert("IndexDB error")
        // console.log(error)
    }
}

const NoteCard = (n) => {

    n = n.n
    let URL = `http://localhost:5000`;

    const deleteNote = async () => {
        // console.log(n._id + " id")
        let id = n._id
        // removeFromIDB(id);
        let respo = await deleteNoteData(`${URL}/deletenote`, { id })
        if (respo.success) {
            removeFromIDB(id);
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