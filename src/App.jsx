import { useEffect, useState, createContext } from "react";
import { createBrowserRouter, RouterProvider, Route, createRoutesFromChildren, Outlet, useLocation, Navigate } from "react-router-dom";
import Landing from "./components/Landing";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import GetGames from "./components/GetGames";
import Layout from "./components/Layout"
import GamesSaved from "./components/GamesSaved";
import GamesPlayed from "./components/GamesPlayed"
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

export const AuthContext = createContext();

const NotFound = () => {
  const location = useLocation();
  console.log(`404: Page not found - ${location.pathname}`);
  return <Navigate to="/" />;
};

export default function App() {
  const [gamesSearched, setGamesSearched] = useState(false);
  const [search, setSearch] = useState("")
  const [user, setUser] = useState(null)
  const [games, setGames] = useState([])
  const [signedIn, setSignedIn] = useState(false);
  const [newUser, setNewUser] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [gamesAdded, setGamesAdded] = useState(true)

  const router = createBrowserRouter(
    createRoutesFromChildren(
      <Route path={"/"} element={<Layout />}>
        <Route index element={<Landing />} />
        <Route path="/search" element={<GetGames />} />
        <Route path="/games-saved" element={<GamesSaved />}/>
        <Route path="/games-played" element={<GamesPlayed />}/>
        <Route path="*" element={<NotFound />} />
        
      </Route>
    )
  );

  function handleMenuClick() {
    setShowMenu(!showMenu);
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

  return (
    <div>
      <AuthContext.Provider 
      value={{games, 
      setGames, 
      user, 
      setUser, 
      gamesSearched, 
      setGamesSearched, 
      search, 
      setSearch,
      newUser,
      setNewUser,
      signedIn,
      setSignedIn,
      email,
      setEmail,
      handleSignIn,
      password,
      setPassword,
      showMenu,
      setShowMenu,
      handleMenuClick,
      gamesAdded,
      setGamesAdded
      }}>
        <RouterProvider router={router}>
          <Outlet />
        </RouterProvider> 
      </AuthContext.Provider>
      
    </div>
  );
}
