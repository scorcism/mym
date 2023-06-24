import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import NoteCard from "../components/NoteCard";

const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_';

function generateString(length) {
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
// let randomStr = generateString(11);

let date;
// date = date.concat(randomStr);
let db;
let dbReq = indexedDB.open('myDatabase', 1);
let allNotes = [];

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
    getAndDisplayNotes(db);
}

function addStickyNote(db, title, desc, type) {
    // Start a database transaction and get the notes object store
    let tx = db.transaction(['notes'], 'readwrite');
    let store = tx.objectStore('notes');

    // Put the sticky note into the object store
    // console.log("Before");
    // console.log(desc, title, type);
    let note = { title: title, desc: desc, type: type, id: date };
    store.add({ note }, date);

    // Wait for the database transaction to complete
    tx.oncomplete = function () { getAndDisplayNotes(db); }
    tx.onerror = function (event) {
        alert('error storing note ' + event.target.errorCode);
    }
}
dbReq.onsuccess = function (event) {
    db = event.target.result;
    getAndDisplayNotes(db)

    // Add some sticky notes
    // addStickyNote(db, 'Sloths are awesome!');
    // addStickyNote(db, 'Order more hibiscus tea');
    // addStickyNote(db, 'And Green Sheen shampoo, the best for sloth fur algae grooming!');
}
function submitNote(title, desc, type) {
    addStickyNote(db, title, desc, type);
}

function getAndDisplayNotes(db) {
    let tx = db.transaction(['notes'], 'readonly');
    let store = tx.objectStore('notes');

    // Create a cursor request to get all items in the store, which 
    // we collect in the allNotes array
    let req = store.openCursor();


    req.onsuccess = function (event) {
        // The result of req.onsuccess in openCursor requests is an
        // IDBCursor
        let cursor = event.target.result;

        if (cursor != null) {
            // If the cursor isn't null, we got an item. Add it to the
            // the note array and have the cursor continue!
            allNotes.push(cursor.value);
            cursor.continue();
        } else {
            // If we have a null cursor, it means we've gotten
            // all the items in the store, so display the notes we got.
            displayNotes(allNotes);
        }
    }

    req.onerror = function (event) {
        alert('error in cursor request ' + event.target.errorCode);
    }
}

function displayNotes(notes) {
    console.log(notes)
    // let listHTML = '<ul>';
    // for (let i = 0; i < notes.length; i++) {
    //     let note = notes[i];
    //     console.log(note)
    //     listHTML += '<li>' + note.title + ' ' + note.desc + ' ' + note.type + '</li>';
    // }

    // document.getElementById('notes').innerHTML = listHTML;
}



const Home = () => {
    let URL = `http://localhost:5000`;

    let navigate = useNavigate();
    const [usernotes, setuserNotes] = useState([]);
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [type, setType] = useState("self");

    let user = localStorage.getItem("user")


    async function postData2(url = "", data = {}) {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem("user")
            },
            body: JSON.stringify(data),
        });
        return response.json(); // parses JSON response into native JavaScript objects
    }

    const submit = async () => {
        let email = localStorage.getItem('user')

        if (title.length < 5 || desc.length < 5) {
            alert("Title or desc length should be at least 5")
            return
        }

        // console.log("submitting: ", title, desc, type)

        let notes = await postData2(`${URL}/addnote`, { title, desc, type, email, date })
        submitNote(title, desc, type, date);
        // console.log(notes)
        if (notes.success) {
            alert(notes.message)
            getuserNotes();
            setDesc("");
            setTitle("");
            setDesc("");

        } else {
            alert(notes.message)
        }
    }

    const postData = async (url = "") => {

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem("user"),
            },
        });
        return response.json();
    }

    const getuserNotes = async () => {
        const notes = await postData(`${URL}/getnotes`)
        setuserNotes(notes.message);
    }


    useEffect(() => {
        if (!user) {
            navigate("/login")
        }
        getuserNotes();

    }, [submit])


    useEffect(() => {
        date = Date.now().toString();
    }, [submit])

    return (
        <>
            <div className="container">

                <h1>Add a Note</h1>
                <div className="form">
                    <div>
                        <div className="mb-3">
                            <label htmlFor="title" className="form-label">Title: </label>
                            <input type="text" value={title} onChange={(e) => { setTitle(e.target.value) }} className="form-control" id="title" aria-describedby="emailHelp" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="desc" className="form-label">Desc: </label>
                            <textarea value={desc} onChange={(e) => { setDesc(e.target.value) }} type="text" className="form-control" id="desc"></textarea>
                        </div>
                        {/* <!-- scorcism --> */}
                        <select className="form-select mb-4" value={type} onChange={(e) => { setType(e.target.value) }} aria-label="Default select example" id="type">
                            <option >Choose Type</option>
                            <option value="self" defaultChecked>self</option>
                            <option value="imp">imp</option>
                            <option value="todo">todo</option>
                        </select>

                        <button id="submit" onClick={submit} className="btn btn-primary">Submit</button>
                    </div>
                </div>
                <h1 className="my-5">Notes</h1>
                <div className="row mb-5">

                    {usernotes.map((n) => {
                        return (
                            <NoteCard db={db} n={n} />
                        )

                    })}

                </div>

            </div>


        </>

    )
}

export default Home