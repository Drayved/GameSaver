import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../App";
import { getAuth, createUserWithEmailAndPassword, signOut, onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, addDoc, doc, setDoc } from "firebase/firestore";
import firebaseApp from "../../firebase";

export default function Navbar() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showGenres, setShowGenres] = useState(false);
  
  const {search, setSearch, selectedOption, setSelectedOption, fetchGames, user, setUser, signedIn, setSignedIn, newUser, setNewUser, menuShowing, email, setEmail, password, setPassword, showMenu, handleMenuClick } = useContext(AuthContext);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setSignedIn(true);
        setUser(user);
      } else {
        setSignedIn(false);
        setUser(null);
      }
    });

    // Clean up the listener
    return () => unsubscribe();
  }, [setUser]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (showMenu && !event.target.closest(".navbar-container") && !event.target.closest(".dropdown-container")) {
        handleMenuClick();
      }
    };

    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [showMenu, handleMenuClick]);

  function handleNewUsers() {
    setNewUser(!newUser);
  }

  async function handleAuthentication(event) {
    event.preventDefault();
    const auth = getAuth();
    const db = getFirestore(firebaseApp); // Initialize Firestore

    try {
      let userCredential;
      let user;
      let wantToPlayCollectionRef;
      let playedGamesCollectionRef;

      if (newUser) {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
        user = userCredential.user;
        setNewUser(false);
        setUser(user.email);
        console.log("User signed up!");

        // Retrieve the updated user object after setting the user
        const updatedUser = auth.currentUser;

        // Save user information to Firestore
        const userDocRef = doc(db, "users", updatedUser.uid);
        await addDoc(userDocRef, { email: updatedUser.email });

        await setDoc(userDocRef, { wantToPlay: {}, playedGames: {} });
      } else {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
        user = userCredential.user; // Get the user object
        setSignedIn(true);
        setUser(user.email);

        const db = getFirestore(firebaseApp); // Initialize Firestore

        // Retrieve the updated user object after setting the user
        const updatedUser = auth.currentUser;

        // Retrieve the user document from Firestore
        const userDocRef = doc(db, "users", updatedUser.uid); // Use the user UID to reference the document

        await setDoc(userDocRef, { wantToPlay: {}, playedGames: {} });
      }
      window.location.reload();
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

  const toggleDropdown = () => {
    setShowDropdown((prevState) => !prevState);
  };

  const toggleGenres = () => {
    setShowGenres((prevState) => !prevState);
  };

  const handleClick = (option) => {
    setSearch(option);
    setSelectedOption(option);
    setShowDropdown(false); // Hide the dropdown menu when an option is clicked
    fetchGames(1, option);
    console.log("handleClick called with option:", option);
  };

  useEffect(() => {
    // Call fetchGames when the search state changes
    fetchGames(1, selectedOption);
  }, [search, selectedOption]);

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
          <ul className="dropdown-list">
          <li onClick={() => handleClick("most-played")}>
            <Link to="/search?sortBy=mostPlayed">Most Played</Link>
          </li>
          <li onClick={() => handleClick("newly-released")}>
            <Link to="/search?sortBy=newlyReleased">Newly Released</Link>
          </li>
          <li onClick={() => handleClick("highest-rated")}>
            <Link to="/search?sortBy=highestRated">Highest Rated</Link>
          </li>
          <li onClick={toggleGenres}>Genres</li>
      {showGenres && (
          <ul className="genre-dropdown">
            <li onClick={() => handleClick("action")}>
              <Link to="/search?genre=action">Action</Link>
            </li>
            <li onClick={() => handleClick("adventure")}>
              <Link to="/search?genre=adventure">Adventure</Link>
            </li>
            <li onClick={() => handleClick("fantasy")}>
              <Link to="/search?genre=fantasy">Fantasy</Link>
            </li>
            <li onClick={() => handleClick("roleplaying")}>
              <Link to="/search?genre=roleplaying">Roleplaying</Link>
            </li>
            <li onClick={() => handleClick("racing")}>
              <Link to="/search?genre=racing">Racing</Link>
            </li>
          </ul>
      )}
    </ul>
        </div>
      )}
    </div>
  );
}
