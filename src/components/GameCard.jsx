import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../App";
import { collection, doc, setDoc, deleteDoc, getDocs, where, query, addDoc } from "firebase/firestore";
import { db } from "../../firebase";

export default function GameCard({ currentPage, setCurrentPage, totalPages, setTotalPages }) {
  const { games, setGames, user } = useContext(AuthContext);
  const startIndex = (currentPage - 1) * 3;
  let endIndex = startIndex + 3;
  const [displayedGames, setDisplayedGames] = useState([]);
  const [gamesAdded, setGamesAdded] = useState(true);

  const isGamesSavedPage = window.location.pathname === "/games-saved";
  const isPlayedGamesPage = window.location.pathname === "/games-played";
  const isSearchPage = window.location.pathname === "/search";
  const [currentPageType, setCurrentPageType] = useState(isGamesSavedPage ? "saved" : "played");

  useEffect(() => {
    setCurrentPageType(isGamesSavedPage ? "saved" : "played");
  }, [isGamesSavedPage]);

  useEffect(() => {
    displayedGames.length <= 0 && setGamesAdded(false);
  }, [displayedGames]);

  useEffect(() => {
    if (!isSearchPage) {
      const updatedDisplayedGames = games.slice(startIndex, endIndex);
      const remainingGames = games.filter((g) => g.id !== games.id);

      setDisplayedGames(updatedDisplayedGames);

      if (remainingGames.length === 0 && currentPage > 1) {
        setCurrentPage((prevPage) => prevPage - 1);
        setGamesAdded(false);
      } else {
        setGamesAdded(true);
      }
    }
  }, [games, startIndex, endIndex, currentPage, currentPageType]);

  useEffect(() => {
    const updatedDisplayedGames = games.slice(startIndex, endIndex);
    setDisplayedGames(updatedDisplayedGames);
  }, [startIndex, currentPage]);

  const fetchGames = async () => {
    try {
      let fetchedGames = [];
  
      if (currentPageType === "saved") {
        const querySnapshot = await getDocs(
          query(collection(db, "users", user.uid, "wantToPlay"), where("played", "==", false))
        );
        fetchedGames = querySnapshot.docs.map((doc) => doc.data());
      } else {
        const querySnapshot = await getDocs(
          query(collection(db, "users", user.uid, "playedGames"), where("played", "==", true))
        );
        fetchedGames = querySnapshot.docs.map((doc) => doc.data());
      }
  
      setGames(fetchedGames);
      setGamesAdded(true);
    } catch (error) {
      console.log("Error fetching games:", error);
    }
  };

  useEffect(() => {
      if (user) {
        fetchGames();
      }
   

    
  }, [currentPageType, setGames]);
  
  const handleWantToPlay = async (event, game) => {
    try {
      if (user) {
        const wantToPlayCollectionRef = collection(db, "users", user.uid, "wantToPlay");
        const playedGamesCollectionRef = collection(db, "users", user.uid, "playedGames");
  
        // Check if the game already exists in the "wantToPlay" subcollection
        const wantToPlayQuerySnapshot = await getDocs(
          query(wantToPlayCollectionRef, where("id", "==", game.id))
        );
        const gameExistsInWantToPlay = !wantToPlayQuerySnapshot.empty;
  
        // Check if the game exists in the "playedGames" subcollection
        const playedGamesQuerySnapshot = await getDocs(
          query(playedGamesCollectionRef, where("id", "==", game.id))
        );
        const gameExistsInPlayedGames = !playedGamesQuerySnapshot.empty;
  
        if (gameExistsInWantToPlay) {
          // Remove the game from the "wantToPlay" subcollection
          const gameDoc = wantToPlayQuerySnapshot.docs[0];
          await deleteDoc(gameDoc.ref);
          console.log("Game removed from the 'wantToPlay' subcollection.");
  
          // Remove the game from local storage
          const localStorageGames = JSON.parse(localStorage.getItem("games"));
          const updatedLocalStorageGames = localStorageGames.filter((g) => g.id !== game.id);
          localStorage.setItem("games", JSON.stringify(updatedLocalStorageGames));
          console.log("Game removed from local storage.");
        } else if (gameExistsInPlayedGames) {
          // Remove the game from the "playedGames" subcollection
          const gameDoc = playedGamesQuerySnapshot.docs[0];
          await deleteDoc(gameDoc.ref);
          console.log("Game removed from the 'playedGames' subcollection.");
  
          // Remove the game from local storage
          const localStorageGames = JSON.parse(localStorage.getItem("games"));
          const updatedLocalStorageGames = localStorageGames.filter((g) => g.id !== game.id);
          localStorage.setItem("games", JSON.stringify(updatedLocalStorageGames));
          console.log("Game removed from local storage.");
        }
  
        // Add the game to the "wantToPlay" subcollection
        await addDoc(wantToPlayCollectionRef, game);
        console.log("Game added to the 'wantToPlay' subcollection successfully.");
      } else {
        console.log("User not authenticated.");
      }
    } catch (error) {
      console.log("Error handling the 'I want to play it' action:", error);
    }
  };
  
  const handlePlayedIt = async (event, game) => {
    try {
      if (user) {
        const playedGamesCollectionRef = collection(db, "users", user.uid, "playedGames");
  
        // Check if the game already exists in the "playedGames" subcollection
        const querySnapshot = await getDocs(
          query(playedGamesCollectionRef, where("id", "==", game.id))
        );
        const gameExists = !querySnapshot.empty;
  
        if (!gameExists) {
          // Add the game to the "playedGames" subcollection
          await addDoc(playedGamesCollectionRef, game);
          console.log("Game added to the 'playedGames' subcollection successfully.");
        } else {
          console.log("Game already exists in the 'playedGames' subcollection.");
        }
      } else {
        console.log("User not authenticated.");
      }
    } catch (error) {
      console.log("Error adding the game to the 'playedGames' subcollection:", error);
    }
  };

    const handleDelete = async (game) => {
      try {
        if (user) {
          const collectionName = currentPageType === "saved" ? "wantToPlay" : "playedGames";
          const gameQuerySnapshot = await getDocs(
            query(collection(db, "users", user.uid, collectionName), where("id", "==", game.id))
          );
          const gameDoc = gameQuerySnapshot.docs[0];
          
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
              <button onClick={(event) => handleWantToPlay(event, game)} className="want-btn">
                I want to play it
              </button>
            )}
            {!isPlayedGamesPage && (
              <button onClick={(event) => handlePlayedIt(event, game)} className="played-btn">
                I played it
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
        
        
        <div className={`${filteredGames.length <= 0 && window.location.pathname || !gamesAdded && window.location.pathname !== "/search" ? "hidden" : ""}`}>
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