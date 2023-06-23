import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {

    let URL = `http://localhost:5000`;

    let navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");


    async function postData(url = "", data = {}) {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        return response.json(); // parses JSON response into native JavaScript objects
    }

    const submit = async () => {

        const validateEmail = (email) => {
            return String(email)
                .toLowerCase()
                .match(
                    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                );
        };

        if (validateEmail(email)) {
            let repo = await postData(`${URL}/signup`, { email, password })
            // console.log(repo)
            if (repo.success) {
                navigate("/login")
            } else {
                alert(repo.message)
            }
        } else {
            alert("Enter valid email");
            setEmail("");
            setPassword("");
        }
    }

    return (
        <>
            <div className="container">
                <h1 className="my-4">Sign Up</h1>
                <div>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email address</label>
                        <input type="email" className="form-control" value={email} id="email" onChange={(e) => { setEmail(e.target.value) }} aria-describedby="emailHelp" />
                        <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                        <input type="password" className="form-control" value={password} id="password" onChange={(e) => { setPassword(e.target.value) }} />
                    </div>
                    <button id="submit" onClick={submit} className="btn btn-primary">Submit</button>
                </div>
            </div>
        </>
    )
}


export default Signup