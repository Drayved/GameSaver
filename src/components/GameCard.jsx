import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../App";
import { collection, doc, setDoc, deleteDoc, getDocs, where, query, addDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useLocation } from "react-router-dom"

export default function GameCard({ currentPage, setCurrentPage, totalPages, setTotalPages}) {
  const { games, setGames, user } = useContext(AuthContext);
  const startIndex = (currentPage - 1) * 3;
  let endIndex = startIndex + 3;
  const [displayedGames, setDisplayedGames] = useState([]);
  const [wantToPlayList, setWantToPlayList] = useState([]);
  const [playedGamesList, setPlayedGamesList] = useState([]);
  const [isWantToPlayHovered, setIsWantToPlayHovered] = useState(false);
  const [isPlayedGamesHovered, setIsPlayedGamesHovered] = useState(false);
  const [hoveredButton, setHoveredButton] = useState(null);
  

  const location = useLocation()

  const isGamesSavedPage = location.pathname === "/games-saved";
  const isPlayedGamesPage = location.pathname === "/games-played";
  const isSearchPage = location.pathname === "/search";
  const [currentPageType, setCurrentPageType] = useState(isGamesSavedPage ? "saved" : "played");




  useEffect(() => {
    if (!isSearchPage) {
      const updatedDisplayedGames = games.slice(startIndex, endIndex);
      const remainingGames = games.filter((g) => g.id !== games.id);
  
      setDisplayedGames(updatedDisplayedGames);
  
      if (remainingGames.length === 0 && currentPage > 1) {
        setCurrentPage((prevPage) => prevPage - 1);
       
      } else {
       
      }
    }
  }, [games, startIndex, endIndex]);

  useEffect(() => {
    const updatedDisplayedGames = games.slice(startIndex, endIndex);
    setDisplayedGames(updatedDisplayedGames);
  }, [endIndex]);

  const fetchGames = async () => {
    try {
      let fetchedGames = [];
  
      if (currentPageType === "saved") {
        const querySnapshot = await getDocs(
          query
          (collection(db, "users", user.uid, "wantToPlay"), 
          where("played", "==", false))
        );
        fetchedGames = querySnapshot.docs.map((doc) => doc.data());
        setWantToPlayList(fetchedGames);
        console.log("wanttoplaylist:", wantToPlayList)
      } else {
        const querySnapshot = await getDocs(
          query
          (collection(db, "users", user.uid, "playedGames"), 
          where("played", "==", true))
        );
        fetchedGames = querySnapshot.docs.map((doc) => doc.data());
        setPlayedGamesList(fetchedGames);
      }
  
      
      
    } catch (error) {
      console.log("Error fetching games:", error);
    }
  };

  useEffect(() => {
      if (user) {
        fetchGames();
      }
  }, [currentPageType]);
  
  const handleAddToCollection = async (event, game, collectionName) => {
    event.stopPropagation();
    
    try {
      if (user) {
        const collectionRef = collection(db, "users", user.uid, collectionName);
  
        // Check if the game already exists in the subcollection
        const querySnapshot = await getDocs(query(collectionRef, where("id", "==", game.id)));
        const gameExists = !querySnapshot.empty;
  
        if (gameExists) {
          // Remove the game from the subcollection
          const gameDoc = querySnapshot.docs[0];
          await deleteDoc(gameDoc.ref);
          console.log(`Game removed from the '${collectionName}' subcollection successfully.`);
  
          // Update the local state based on the collection name
          if (collectionName === "playedGames") {
            setPlayedGamesList((prevPlayedGamesList) =>
              prevPlayedGamesList.filter((g) => g.id !== game.id)
            );
          } else if (collectionName === "wantToPlay") {
            setWantToPlayList((prevWantToPlayList) =>
              prevWantToPlayList.filter((g) => g.id !== game.id)
            );
          }
        } else {
          // Add the game to the subcollection
          await addDoc(collectionRef, game);
          console.log(`Game added to the '${collectionName}' subcollection successfully.`);
  
          // Update the local state
          if (collectionName === "playedGames") {
            setPlayedGamesList((prevPlayedGamesList) => [...prevPlayedGamesList, game]);
          } else if (collectionName === "wantToPlay") {
            setWantToPlayList((prevWantToPlayList) => [...prevWantToPlayList, game]);
          }
        }
      } else {
        console.log("User not authenticated.");
      }
    } catch (error) {
      console.log(`Error adding the game to the '${collectionName}' subcollection:`, error);
    }
  
    if (!isSearchPage) {
      handleDelete(game);
    }
  };
    
  const handleDelete = async (game, collectionRef = null) => {
    try {
      if (user) {
        let gameDoc;
  
        if (collectionRef) {
          const querySnapshot = await getDocs(
            query(collectionRef, where("id", "==", game.id))
          );
          gameDoc = querySnapshot.docs[0];
        } else {
          const collectionName = currentPageType === "saved" ? "wantToPlay" : "playedGames";
          const gameQuerySnapshot = await getDocs(
            query(collection(db, "users", user.uid, collectionName), where("id", "==", game.id))
          );
          gameDoc = gameQuerySnapshot.docs[0];
        }
  
        if (gameDoc) {
          // Delete the game document from the subcollection
          await deleteDoc(gameDoc.ref);
          console.log("Game deleted successfully!");
  
          // Remove the game from the local state
          const remainingGames = games.filter((g) => g.id !== game.id);
          setGames(remainingGames);
  
          const remainingDisplayedGames = displayedGames.filter((g) => g.id !== game.id);
          setDisplayedGames(remainingDisplayedGames);
  
          if (remainingDisplayedGames.length === 0 && currentPage > 1) {
            setCurrentPage((prevPage) => prevPage - 1); // Navigate to the previous page
          }
        } else {
          console.log("Game document not found in the subcollection.");
        }
      } else {
        console.log("User not authenticated.");
        // You can add logic to show a message or redirect the user to the sign-in page
      }
    } catch (error) {
      console.log("Error deleting game:", error);
    }
  };

  useEffect(() => {
    const fetchPlayedGames = async () => {
      try {
        if (user) {
          const userDocRef = doc(db, "users", user.uid);
  

            const playedGamesQuerySnapshot = await getDocs(collection(userDocRef, "playedGames"));
            const playedGamesData = playedGamesQuerySnapshot.docs.map((doc) => doc.data());
            setPlayedGamesList(playedGamesData);
            console.log("playedGames:", playedGamesData);
          
        }
      } catch (error) {
        console.log("Error fetching games:", error);
      }
    };
  
    fetchPlayedGames();
  }, [user, currentPageType]);

  useEffect(() => {
    const fetchWantToPlayGames = async () => {
      try {
        if (user) {
          const userDocRef = doc(db, "users", user.uid);
  
          
            const wantToPlayQuerySnapshot = await getDocs(collection(userDocRef, "wantToPlay"));
            const wantToPlayData = wantToPlayQuerySnapshot.docs.map((doc) => doc.data());
            setWantToPlayList(wantToPlayData);
            console.log("wantToPlayList:", wantToPlayData);
          

         
        }
      } catch (error) {
        console.log("Error fetching games:", error);
      }
    };
  
    fetchWantToPlayGames();
  }, [user, currentPageType]);

    const handlePreviousPage = () => {
      if (currentPage > 1) {
        setCurrentPage((prevPage) => prevPage - 1);
      }
    };
  
    const handleNextPage = () => {
      if (currentPage < totalPages) {
        setCurrentPage((prevPage) => prevPage + 1);
      }
    };

    const isGameAdded = (game, collectionName) => {
      if (collectionName === "wantToPlay") {
        return (
          wantToPlayList.length > 0 &&
          wantToPlayList.some((playedGame) => playedGame.id === game.id)
        );
      } else if (collectionName === "playedGames") {
        return (
          playedGamesList.length > 0 &&
          playedGamesList.some((playedGame) => playedGame.id === game.id)
        );
      }
      return false;
    };

    const handleWantToPlayMouseEnter = (buttonId) => {
      setIsWantToPlayHovered(true);
      setHoveredButton(buttonId);
    };
  
    const handleWantToPlayMouseLeave = () => {
      setIsWantToPlayHovered(false);
      setHoveredButton(null);
    };
  
    const handlePlayedGamesMouseEnter = (buttonId) => {
      setIsPlayedGamesHovered(true);
      setHoveredButton(buttonId);
    };
  
    const handlePlayedGamesMouseLeave = () => {
      setIsPlayedGamesHovered(false);
      setHoveredButton(null);
    };

    const filteredGames = displayedGames.filter((game) => Object.keys(game).length > 0)

    return(
        <div className="games-card-container">
        {filteredGames.map((game) => (
          <div key={game.id} className="games-card">
            <h3 className="game-name">{game.name}</h3>
            <div className="game-info">
              <img
                className="game-img"
                src={game.background_image}
                alt={game.name}
              ></img>
              <div className="game-details">
                <div className="game-release">
                  <p>Released: </p>
                  <p className="release">{game.released}</p>
                </div>
                <div className="game-genres">
                  <p>Genres:</p>
                  <p className="genres"> {game.genres.map((genre) => genre.name).slice(0, 2).join(", ")}</p>
                </div>
                
              </div>
              
            </div>
            <div className="more-info-container">
              <button onClick={() => window.open(`https://rawg.io/games/${game.name.replace(/\s/g, "-").replace(/:/g, "")}`)} className="more-info-btn">More Info</button>
            </div>
            
            <div className="list-btns">
            {!isGamesSavedPage && (
              <button
                onClick={(event) => handleAddToCollection(event, game, "wantToPlay")}
                className={`want-btn ${isGameAdded(game, "wantToPlay") && (isWantToPlayHovered && hoveredButton === game.id) ? "remove-btn" : ""}`}
                onMouseEnter={() => handleWantToPlayMouseEnter(game.id)}
                onMouseLeave={handleWantToPlayMouseLeave}
              >
                {isGameAdded(game, "wantToPlay")  ? (
                  <span className={`Added ${isWantToPlayHovered && hoveredButton === game.id ? "hide-on-hover" : ""}`}>
                    Added
                  </span>
                ) : (
                  "I want to play it"
                )}
                <span className={`remove-text ${isWantToPlayHovered ? "show-on-hover" : ""}`}>
                  Remove
                </span>
              </button>
            )}
            {!isPlayedGamesPage && (
              <button
                onClick={(event) => handleAddToCollection(event, game, "playedGames")}
                className={`played-btn ${isGameAdded(game, "playedGames") && isPlayedGamesHovered && hoveredButton === game.id ? "remove-btn" : ""}`}
                onMouseEnter={() => handlePlayedGamesMouseEnter(game.id)}
                onMouseLeave={handlePlayedGamesMouseLeave}
              >
                {isGameAdded(game, "playedGames") ? (
                  <span className={`Added ${isPlayedGamesHovered && hoveredButton === game.id ? "hide-on-hover" : ""}`}>
                    Added
                  </span>
                ) : (
                  "I played it"
                )}
                <span className={`remove-text ${isPlayedGamesHovered  ? "show-on-hover" : ""}`}>
                  Remove
                </span>
              </button>
            )}
          
            {isSearchPage ? "" : 
                <button className="remove-btn" onClick={() => handleDelete(game)}>
                  Remove
                </button>
            }  
            </div>
          </div>
        ))}
        
        
        <div className={`${filteredGames.length <= 0 && !isSearchPage ? "hidden" : ""}`}>
        <div className="page-container page-bottom">
          <button
            className="prev-page font-semibold"
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
          >
            Previous Page
          </button>
          <p className="page-dash">-</p>
          <button
            className="next-page font-semibold"
            onClick={handleNextPage}
            disabled={currentPage === totalPages || isSearchPage && currentPage === 7}
          >
            Next Page
          </button>
          
        </div>
        <p className={`page-displayed `}>{currentPage} - {isSearchPage && totalPages > 7 ? "7" : totalPages}</p>
        
        </div>
            
        
      </div>
    )
}