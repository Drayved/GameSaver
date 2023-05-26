import { useEffect, useState, createContext } from "react";
import { createBrowserRouter, RouterProvider, Route, createRoutesFromChildren } from "react-router-dom";
import Landing from "./components/Landing";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import GetGames from "./components/GetGames";
import Layout from "./components/Layout"


export const AuthContext = createContext();

export default function App() {
  const [gamesSearched, setGamesSearched] = useState(false);
  const [search, setSearch] = useState("")
  const [user, setUser] = useState(null)

  const router = createBrowserRouter(
    createRoutesFromChildren(
      <Route path={"/"} element={<Layout />}>
        <Route path="search" element={<GetGames />} />
      </Route>
    )
  );

  return (
    <div>
      <AuthContext.Provider value={{ user, setUser, gamesSearched, setGamesSearched, search, setSearch}}>
        <RouterProvider router={router} />
      </AuthContext.Provider>
      
    </div>
  );
}
