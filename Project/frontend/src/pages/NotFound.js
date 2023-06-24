import { Link } from 'react-router-dom';

const NotFound = () =>{
    return (
        <>
            <div className='d-flex' style={{flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:"20rem"}}> 
                <h1 style={{fontSize:"10rem", color:"red"}}>404</h1>
                <h3><Link to={"/login"}>Login</Link> or <Link to={"/signup"}>Signup</Link></h3>

            </div>
        
        </>
    )
}

export default NotFound;