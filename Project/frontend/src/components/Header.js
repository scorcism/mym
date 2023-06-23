import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {

    let navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem("user");
        navigate("/login")
    }

    let user = localStorage.getItem("user")

    useEffect(() => {
        

    }, [])

    return (
        <>
            <nav className="navbar navbar-expand-lg bg-body-tertiary">
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/">Noteeess</Link>
                </div>
                <div className="d-flex" role="search" id="auth-button">
                    {
                        user &&
                        <button onClick={logout} className="btn btn-outline-success mx-2" type="submit" id="logout">Logout</button>
                    }
                    {
                        !user && <div id="basic_auth " className='d-flex'>
                            <Link to="/login"><button className="btn btn-outline-success mx-2">Login</button></Link>
                            <Link to="/signup"><button className="btn btn-outline-success mx-2" >Signup</button></Link>
                        </div>
                    }

                </div>
            </nav>
        </>
    )
}

export default Header