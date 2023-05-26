import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../App";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import firebaseApp from "../../firebase";

export default function Navbar() {
    const [showMenu, setShowMenu] = useState(false);
    const [signedIn, setSignedIn] = useState(false);
    const [newUser, setNewUser] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const {user, setUser} = useContext(AuthContext)

    
    function handleClick() {
        setShowMenu(!showMenu);
    }

    function handleNewUsers() {
        setNewUser(!newUser);
    }

    async function handleSignIn(event) {
        event.preventDefault();
        const auth = getAuth();
        try {
        await signInWithEmailAndPassword(auth, email, password);
        setSignedIn(true);
        setUser(email)
        console.log(user)
        console.log("User signed in!");
        } catch (error) {
        console.log("Error signing in:", error);
        }
    }

    async function handleSignUp(event) {
        event.preventDefault();
        const auth = getAuth();
        const db = getFirestore(firebaseApp); // Initialize Firestore
        try {
        await createUserWithEmailAndPassword(auth, email, password);
        setNewUser(false);
        setUser(email)
        console.log("User signed up!");

        // Save user information to Firestore
        const userDocRef = await addDoc(collection(db, "users"), {
            email: email,
        });
        console.log("User document created with ID:", userDocRef.id);
        } catch (error) {
        console.log("Error signing up:", error);
        }
    }

    async function handleSignOut() {
        const auth = getAuth();
        try {
        await signOut(auth);
        setSignedIn(false);
        console.log("User signed out!");
        } catch (error) {
        console.log("Error signing out:", error);
        }
    }

    return (
        <div>
        <div className="navbar-container">
            <h1 className="title">GameSaver</h1>
            <img className="account-img" src="./images/account.png" alt="account" onClick={handleClick} />
        </div>
        
        {showMenu ? (
            <div className={signedIn ? "signed-in-container" : "dropdown-container"}>
            {signedIn ? (
                <div className="signed-in-menu">
                <p className="signed-in">Signed in as {email}</p>
                <button className="sign-out-btn" onClick={handleSignOut}>
                    Sign Out
                </button>
                </div>
            ) : (
                <>
                <p className="sign-in">{newUser ? "Sign Up" : "Sign In"}</p>
                <form className="dropdown-form" onSubmit={newUser ? handleSignUp : handleSignIn}>
                    <label htmlFor="email">Email:</label>
                    <input
                    className="inputs"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    />
                    <label htmlFor="password">Password:</label>
                    <input
                    className="inputs"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    />
                    {newUser ? (
                    <button className="sign-in-btn" type="submit">
                        Sign Up
                    </button>
                    ) : (
                    <button className="sign-in-btn" type="submit">
                        Sign In
                    </button>
                    )}
                </form>
                <div className="new-user">
                    {newUser ? (
                    <button onClick={handleNewUsers} className="sign-up-btn"
                    >
                        Back to Login
                    </button>
                    ) : (
                    <button onClick={handleNewUsers} className="sign-up-btn">
                        New user? Sign up here
                    </button>
                    )}
                </div>
                </>
            )}
            </div>
            ) : (
            ""
            )}
        </div>
        );
    }