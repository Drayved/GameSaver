import { useEffect, useState, createContext } from "react";
import { createBrowserRouter, RouterProvider, Route, createRoutesFromChildren } from "react-router-dom";
import Landing from "./components/Landing";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import GetGames from "./components/GetGames";
import Layout from "./components/Layout"
import GamesSaved from "./components/GamesSaved";
import GamesPlayed from "./components/GamesPlayed"


export const AuthContext = createContext();

export default function App() {
  const [gamesSearched, setGamesSearched] = useState(false);
  const [search, setSearch] = useState("")
  const [user, setUser] = useState(null)
  const [games, setGames] = useState([])
  const [signedIn, setSignedIn] = useState(false);
  const [newUser, setNewUser] = useState(false);
  const [email, setEmail] = useState("");

  const router = createBrowserRouter(
    createRoutesFromChildren(
      <Route path={"/"} element={<Layout />}>
        <Route index element={<Landing />} />
        <Route path="/search" element={<GetGames />} />
        <Route path="/games-saved" element={<GamesSaved />}/>
        <Route path="/games-played" element={<GamesPlayed />}/>
      </Route>
    )
  );

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
      setEmail
      }}>
        <RouterProvider router={router} />
      </AuthContext.Provider>
      
    </div>
  );
}
