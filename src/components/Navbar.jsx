import React, { useState, useContext, useEffect } from "react"
import { Link } from "react-router-dom"
import { AuthContext } from "../App"
import { getAuth, createUserWithEmailAndPassword, signOut, onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth"
import { getFirestore, collection, addDoc, doc, setDoc } from "firebase/firestore"
import firebaseApp from "../../firebase"

export default function Navbar() {
  
  const [showGenres, setShowGenres] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  
  const { 
    setSearch, 
    user, 
    setUser, 
    signedIn, 
    setSignedIn, 
    newUser, 
    setNewUser, 
    email, 
    setEmail, 
    password, 
    setPassword,
    showMenu, 
    handleMenuClick,
    selectedGenre,      
    setSelectedGenre,
    toggleDropdown,
    showDropdown,
    setShowDropdown
   } = useContext(AuthContext)

  useEffect(() => {
    const auth = getAuth()
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setSignedIn(true)
        setUser(user)
      } else {
        setSignedIn(false)
        setUser(null)
      }
    })

  
    return () => unsubscribe()
  }, [setUser])



  function handleNewUsers() {
    setNewUser(!newUser)
  }

  async function handleAuthentication(event) {
    event.preventDefault()
    const auth = getAuth()
    const db = getFirestore(firebaseApp) 

    try {
      let userCredential
      let user


      if (newUser) {
        userCredential = await createUserWithEmailAndPassword(auth, email, password)
        user = userCredential.user
        setNewUser(false)
        setUser(user.email)
        console.log("User signed up!")

       
        const updatedUser = auth.currentUser

       
        const userDocRef = doc(db, "users", updatedUser.uid)
        await addDoc(userDocRef, { email: updatedUser.email })

        await setDoc(userDocRef, { wantToPlay: {}, playedGames: {} })
      } else {
        userCredential = await signInWithEmailAndPassword(auth, email, password)
        user = userCredential.user 
        setSignedIn(true)
        setUser(user.email)

        const db = getFirestore(firebaseApp) 

       
        const updatedUser = auth.currentUser

       
        const userDocRef = doc(db, "users", updatedUser.uid) 
        await setDoc(userDocRef, { wantToPlay: {}, playedGames: {} })
      }
      window.location.reload()
    } catch (error) {
      setErrorMessage("Invalid email or password.")
      
    }
  }

  async function handleSignOut() {
    const auth = getAuth()
    try {
      await signOut(auth)
      setSignedIn(false)
      console.log("User signed out!")
    } catch (error) {
      console.log("Error signing out:", error)
    }
  }



  const handleGenreOptionClick = (genre) => {
    setSelectedGenre(genre)
    setShowDropdown(false)
    setSearch("")
    localStorage.setItem('genre', selectedGenre)
    localStorage.setItem('search', "")
    console.log("handleGenreOptionClick called with genre:", genre)
  }
  

  return (
    <div>
      <div className="navbar-container">
        <img className="menu" src="images/menu.png" alt="menu icon" onClick={toggleDropdown} />
        <h1 className="title">
          <Link to="/">GameSaver</Link>
        </h1>
        <img className="account-img" src="./images/account.png" alt="account" onClick={handleMenuClick} />
      </div>

      {showMenu ? (
        <div className={signedIn ? "signed-in-container z-50" : "dropdown-container z-50"}>
          {signedIn ? (
            <div className="signed-in-menu">
              <p className="signed-in">Signed in as {user && email || user.email}</p>
              <button className="sign-out-btn" onClick={handleSignOut}>
                Sign Out
              </button>
            </div>
          ) : (
            <>
              <p className="sign-in">{newUser ? "Sign Up" : "Sign In"}</p>
              <form className="dropdown-form" onSubmit={handleAuthentication}>
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
                {errorMessage && <p className="error-message">{errorMessage}</p>}
              </form>
              <div className="new-user">
                {newUser ? (
                  <button onClick={handleNewUsers} className="sign-up-btn">
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

      {showDropdown && (
        <div className="dropdown-menu">
          <ul className="genre-dropdown">
            <li onClick={() => handleGenreOptionClick("action")}>
              <Link to="/search?genre=action">Action</Link>
            </li>
            <li onClick={() => handleGenreOptionClick("adventure")}>
              <Link to="/search?genre=adventure">Adventure</Link>
            </li>
            <li onClick={() => handleGenreOptionClick("strategy")}>
              <Link to="/search?genre=strategy">Strategy</Link>
            </li>
            <li onClick={() => handleGenreOptionClick("role-playing-games-rpg")}>
              <Link to="/search?genre=role-playing-games-rpg">RPG</Link>
            </li>
            <li onClick={() => handleGenreOptionClick("racing")}>
              <Link to="/search?genre=racing">Racing</Link>
            </li>
            <li onClick={() => handleGenreOptionClick("shooter")}>
              <Link to="/search?genre=shooter">Shooter</Link>
            </li>
            <li onClick={() => handleGenreOptionClick("puzzle")}>
              <Link to="/search?genre=puzzle">Puzzle</Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  )
}
