import { useState, useEffect, useContext} from "react"
import Landing from "./Landing";
import Navbar from "./Navbar";
import Footer from "./Footer";
import GetGames from "./GetGames";
import { AuthContext } from "../App";

export default function Layout(){
    const {gamesSearched, setGamesSearched} = useContext(AuthContext);



    return(
        <div>
            <Navbar />
            { gamesSearched ?
            <GetGames />
            :<Landing />
            }
            <Footer />
        </div>
    )
}