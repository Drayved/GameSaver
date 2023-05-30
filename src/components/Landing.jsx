import { useState, useEffect, useContext} from 'react'
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../App";

export default function Landing(){
    const navigate = useNavigate();
    const {gamesSearched, setGamesSearched, search, setSearch} = useContext(AuthContext)

    function handleSearch(e) {
        setSearch(e.target.value.toLowerCase());
        if(e.key === "Enter"){
            navigate('/search');
            setGamesSearched(true)
            console.log(e.target.value)
        }

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
                    onKeyDown={handleSearch}
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