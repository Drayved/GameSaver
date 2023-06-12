import { useState, useEffect, useContext} from 'react'
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from "../App";

export default function Landing(){
    const navigate = useNavigate();
    
    const {setGamesSearched, search, setSearch, signedIn, user, email, handleMenuClick} = useContext(AuthContext)

    function handleSearch() {
        navigate('/search');
        setGamesSearched(true);
        console.log(search);
      }

      function handleInputChange(e) {
        setSearch(e.target.value.toLowerCase());
      }

      useEffect(() => {
        setSearch(''); // Clear the search input when the page is loaded
      }, []);

    return(
        <div className="landing-container">
            <div className="find-games-container">
                <h1 className="find-games">Find Games you want to play</h1>
                <div className='search-container'>
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
            </div>
            
            <div className="save-games-container">
                <h1 className="save-games">Save Games to your personal list</h1>
                <div className='list-btns-landing'>
                    <Link to="/games-saved">
                        <div className='games-saved-container'>
                            <img className='games-saved-landing' src='/images/computer-game.png' alt="Games to play"/>
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
            {!signedIn ?
                <div>
                    <h1 className="sign-in-text">Sign in to access your list on any device!</h1>
                    <div className='login-landing-container'>
                        <div className='login-landing-content'>
                            <img className='login-landing' src="images/login.png" alt="Login button" onClick={handleMenuClick} />
                            <p className='login-landing-text'>Login</p>
                        </div>
                    </div>
                </div>
                : 
                <div>
                    <h1 className='sign-in-text'>signed in as:</h1>
                    <div className='lets-play-container'>
                        <p>{user.email || email}</p>
                        <img src='images/game-console.png' className='lets-play-img' alt="game console" onClick={handleMenuClick}/>
                        
                    </div>

                </div>}
            </div>
            
        </div>
    )
}