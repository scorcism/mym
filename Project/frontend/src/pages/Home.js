import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import NoteCard from "../components/NoteCard";

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
        let date = Date.now().toString();
        let notes = await postData2(`${URL}/addnote`, { title, desc, type, email, date })
        // submitNote(title, desc, type, date);
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

    const  postData = async (url = "")=> {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem("user")
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
    }, [usernotes])

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
                            <NoteCard n={n} />
                        )

                    })}

                </div>

            </div>


        </>

    )
}

export default Home