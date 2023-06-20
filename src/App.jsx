import { useEffect, useState, createContext } from "react";
import { createBrowserRouter, RouterProvider, Route, createRoutesFromChildren, Outlet, useLocation, Navigate } from "react-router-dom";
import Landing from "./components/Landing";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import GetGames from "./components/GetGames";
import Layout from "./components/Layout"
import GamesSaved from "./components/GamesSaved";
import GamesPlayed from "./components/GamesPlayed"


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
  const [menuShowing, setMenuShowing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [selectedOption, setSelectedOption] = useState("");
  const apiKey = "10cab07048cb4f6591685d4bf79954bd";


  const fetchGames = async (page, option) => {
    try {
      let url = `https://api.rawg.io/api/games?key=${apiKey}&page=${page}&search=${search}`;
  
      if (option === "genres") {
        url += `&genres=${selectedOption}`;
        console.log(option)
      } else if (option) {
        url += `&ordering=${selectedOption}`;
      }
      // Include any additional options here
      console.log('Making API request with URL:', url);
      const response = await fetch(url);
      const data = await response.json();
      setGames(data.results);

    } catch (error) {
      console.log(error);
      setLoading(false)
    }
  };
  setTimeout(() => {
    setLoading(false);
  }, 2000); 
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
    setMenuShowing(!menuShowing)
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
      password,
      setPassword,
      showMenu,
      setShowMenu,
      handleMenuClick,
      menuShowing,
      fetchGames,
      loading,
      setLoading,
      apiKey,
      selectedOption,
      setSelectedOption
      }}>
        <RouterProvider router={router}>
          <Outlet />
        </RouterProvider> 
      </AuthContext.Provider>
      
    </div>
  );
}
