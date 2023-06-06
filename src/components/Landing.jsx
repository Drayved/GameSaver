import { useState, useEffect, useContext} from 'react'
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from "../App";

export default function Landing(){
    const navigate = useNavigate();
    const {gamesSearched, setGamesSearched, search, setSearch} = useContext(AuthContext)

    function handleSearch() {
        navigate('/search');
        setGamesSearched(true);
        console.log(search);
      }

      function handleInputChange(e) {
        setSearch(e.target.value.toLowerCase());
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
                    onChange={handleInputChange}
                    onKeyDown={e => e.key === "Enter" && handleSearch()}
                />
                <img onClick={handleSearch} className='games-search-landing' src='/images/search.png'></img>
            </div>
            
            <div className="save-games-container">
                <h1 className="save-games">Save Games to your personal list</h1>
                <div className='list-btns-landing'>
                    <Link to="/games-saved">
                        <div className='games-saved-container'>
                            <img className='games-saved-landing' src='/images/game-console.png' alt="Games to play"/>
                            <p className='text-sm'>Games to play</p>
                        </div>
                    </Link>
                    
                    <Link to="/games-played">
                        <div className='games-beat-container'>
                            <img className='games-played-landing' src='/images/game-over.png' alt="Games beaten"/>
                            <p className='text-sm'>Games beaten</p>
                        </div>
                    </Link>
                    
                </div>
                
            </div>
            
            <div>
                <h1 className="sign-in-text">Sign in to access your list on any device!</h1>
                
            </div>
            
        </div>
    )
}