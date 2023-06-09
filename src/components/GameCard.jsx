import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../App";
import { collection, doc, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase";

export default function GameCard({ currentPage, setCurrentPage, totalPages, setTotalPages}){
    const { games, setGames, user } = useContext(AuthContext)
    const startIndex = (currentPage - 1) * 3;
    let endIndex = startIndex + 3;
    const [displayedGames, setDisplayedGames] = useState(games.slice(startIndex, endIndex))
    const [gamesAdded, setGamesAdded] = useState(true)
    const [loading, setLoading] = useState(true);

    const isGamesSavedPage = window.location.pathname === "/games-saved";
    const isPlayedGamesPage = window.location.pathname === "/games-played";
    const isSearchPage = window.location.pathname === "/search"
    const [currentPageType, setCurrentPageType] = useState(isGamesSavedPage ? "saved" : "played")

    useEffect(() => {
      setCurrentPageType(isGamesSavedPage ? "saved" : "played");
    }, [isGamesSavedPage]);

    useEffect(() => {
      setLoading(true);
      const updatedDisplayedGames = games.slice(startIndex, endIndex);
      setDisplayedGames(updatedDisplayedGames);
      setLoading(false);
    }, [games, startIndex, endIndex]);

    useEffect(() => {
      displayedGames.length <= 0 && setGamesAdded(false)
    }, [displayedGames])
  
    useEffect(() => {
      const updatedDisplayedGames = games.slice(startIndex, endIndex);
      setDisplayedGames(updatedDisplayedGames);
    }, [games, startIndex, endIndex]);

    const fetchGames = async () => {
      try {
        let fetchedGames = [];
        if (isGamesSavedPage) {
          const querySnapshot = await getDocs(
            query(collection(db, "wantToPlay"), where("game.played", "==", false))
          );
          fetchedGames = querySnapshot.docs.map((doc) => doc.data().game);
        } else if (isPlayedGamesPage) {
          const querySnapshot = await getDocs(
            query(collection(db, "playedGames"), where("game.played", "==", true))
          );
          fetchedGames = querySnapshot.docs.map((doc) => doc.data().game);
        }
        setGames(fetchedGames);
      } catch (error) {
        console.log("Error fetching games:", error);
      }
    };
  
    useEffect(() => {
      if (user) {
        fetchGames();
      }
    }, [user, isGamesSavedPage, isPlayedGamesPage, setGames]);
  
    const handleWantToPlay = async (event, game) => {
      event.preventDefault();
      try {
        if (user) {
          const gameData = { game };
          const collectionName = currentPageType === "played" ? "playedGames" : "wantToPlay";
    
          // Delete the game from the original list if it exists in Firebase
          await deleteDoc(doc(collection(db, collectionName), game.id.toString()));
    
          // Add the game to the new list in Firebase
          await setDoc(doc(collection(db, "wantToPlay"), game.id.toString()), gameData);
    
          // Update the local state accordingly
          const remainingGames = games.filter((g) => g.id !== game.id);
          setGames(remainingGames);

          if (remainingGames.length === 0 && currentPage > 1) {
            setCurrentPage((prevPage) => prevPage - 1); // Navigate to previous page
            return; // Exit the function to prevent further operations
          }

          setDisplayedGames((prevGames) => prevGames.filter((g) => g.id !== game.id));
    
          console.log("Game moved to the 'I want to play' list!");
        } else {
          console.log("User not authenticated.");
          // You can add a logic to show a message or redirect the user to the sign-in page
        }
      } catch (error) {
        console.log("Error moving game to the 'I want to play' list:", error);
      }
    };
  
    const handlePlayedIt = async (event, game) => {
      event.preventDefault();
      try {
        if (user) {
          const gameData = { game };
          const collectionName = currentPageType === "played" ? "playedGames" : "wantToPlay";
    
          // Delete the game from the original list if it exists in Firebase
          await deleteDoc(doc(collection(db, collectionName), game.id.toString()));
    
          // Add the game to the new list in Firebase
          await setDoc(doc(collection(db, "playedGames"), game.id.toString()), gameData);
    
          // Update the local state accordingly
          const remainingGames = games.filter((g) => g.id !== game.id);
          setGames(remainingGames);

          if (remainingGames.length === 0 && currentPage > 1) {
            setCurrentPage((prevPage) => prevPage - 1); // Navigate to previous page
            return; // Exit the function to prevent further operations
          }

          setDisplayedGames((prevGames) => prevGames.filter((g) => g.id !== game.id));
    
          console.log("Game moved to the 'Played it' list!");
        } else {
          console.log("User not authenticated.");
          // You can add a logic to show a message or redirect the user to the sign-in page
        }
      } catch (error) {
        console.log("Error moving game to the 'Played it' list:", error);
      }
    };

const handleDelete = async (game) => {
  try {
    if (user) {
      const collectionName = currentPageType === "saved" ? "wantToPlay" : "playedGames";

      // Delete the game from Firebase
      await deleteDoc(doc(collection(db, collectionName), game.id.toString()));
      console.log("Game deleted successfully!");

      // Remove the game from the local state
      const remainingGames = games.filter((g) => g.id !== game.id);
      setGames(remainingGames);

      const remainingDisplayedGames = displayedGames.filter((g) => g.id !== game.id);
      setDisplayedGames(remainingDisplayedGames);

      if (remainingDisplayedGames.length === 0 && currentPage > 1) {
        setCurrentPage((prevPage) => prevPage - 1); // Navigate to previous page
      }
    } else {
      console.log("User not authenticated.");
      // You can add a logic to show a message or redirect the user to the sign-in page
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




    return (
      <div className="games-card-container">
        {!loading && (
          <>
            {displayedGames.map((game) => (
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
                      <p className="genres">
                        {game.genres.map((genre) => genre.name).slice(0, 2).join(", ")}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="more-info-container">
                  <button
                    onClick={() =>
                      window.open(
                        `https://rawg.io/games/${game.name.replace(/\s/g, "-").replace(/:/g, "")}`
                      )
                    }
                    className="more-info-btn"
                  >
                    More Info
                  </button>
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
                  {!isSearchPage && (
                    <button className="remove-btn" onClick={() => handleDelete(game)}>
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))}
            <div className={`${!gamesAdded && window.location.pathname !== "/search" ? "hidden" : ""}`}>
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
                  disabled={currentPage === totalPages}
                >
                  Next Page
                </button>
              </div>
              <p className={`page-displayed`}>
                {currentPage} - {totalPages}
              </p>
            </div>
          </>
        )}
      </div>
    )
    
}