import { useState } from "react"

export default function Navbar(){
    const [showMenu, setShowMenu] = useState(false)
    const [signedIn, setSignedIn] = useState(false)
    function handleClick(){
        setShowMenu(!showMenu)
    }

    return(
        <div>
            <div className="navbar-container">
                <h1 className="title">GameSaver</h1>
                <img 
                    className="account-img" 
                    src="./images/account.png" 
                    alt="account" 
                    onClick={handleClick} 
                />
            </div>
            {showMenu ? 
            <div className="dropdown-container">
                <p className="sign-in">Sign In</p>
                <form className="dropdown-form" action="">
                    <label htmlFor="email">Email:</label>
                    <input className="inputs" type="email" />
                    <label htmlFor="password">Password:</label>
                    <input className="inputs" type="password" />
                    <button className="sign-in-btn">Sign In</button>
                </form>
                <div className="new-user">
                    <button className="sign-up-btn">New user? Sign up here</button>
                    <button>Login as Guest</button>
                </div>
            </div> : ""}
        </div>
    )
}