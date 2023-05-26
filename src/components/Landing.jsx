import { useState, useEffect, useContext} from 'react'
import { AuthContext } from "../App";

export default function Landing(){
    
    const {gamesSearched, setGamesSearched, search, setSearch} = useContext(AuthContext)

    function handleSearch(e) {
        setSearch(e.target.value.toLowerCase());
        setGamesSearched(true)
        console.log(e.target.value)
      }

    return(
        <div className="landing-container">
            <div className="find-games-container">
                <h1 className="find-games">Find Games you want to play</h1>
                <input 
                    className="search" 
                    type="text" 
                    placeholder="Find games"
                    value={search}
                    onChange={handleSearch}
                    onKeyUp={handleSearch}
                />
            </div>
            
            <div className="save-games-container">
                <h1 className="save-games">Save Games you've already beat</h1>
                
            </div>
            
            <div>
                <h1 className="sign-in-text">Sign in to access your list on any device!</h1>
            </div>
            
        </div>
    )
}