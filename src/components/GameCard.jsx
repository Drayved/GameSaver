import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../App";
import { collection, doc, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase";
export default function GameCard({ currentPage, setCurrentPage, totalPages, setTotalPages}){
    const { games, setGames, user } = useContext(AuthContext)
    const startIndex = (currentPage - 1) * 3;
    let endIndex = startIndex + 3;
    const [displayedGames, setDisplayedGames] = useState(games.slice(startIndex, endIndex))

    useEffect(() => {
      const updatedDisplayedGames = games.slice(startIndex, endIndex);
      setDisplayedGames(updatedDisplayedGames);
    }, [games, startIndex, endIndex]);

    const handleWantToPlay = async (event, game) => {
      event.preventDefault();
      try {
        if (user) {
          const gameData = { game };
          await setDoc(doc(collection(db, "wantToPlay"), game.id.toString()), gameData);
          console.log("Game added to the 'I want to play' list!");
        } else {
          console.log("User not authenticated.");
          // You can add a logic to show a message or redirect the user to the sign-in page
        }
      } catch (error) {
        console.log("Error adding game to 'I want to play' list:", error);
      }
    };
  
    const handlePlayedIt = async (event, game) => {
      event.preventDefault();
      try {
        if (user) {
          const gameData = { game };
          await setDoc(doc(collection(db, "playedGames"), game.id.toString()), gameData);
          console.log("Game added to the 'I played it' list!");
        } else {
          console.log("User not authenticated.");
          // You can add a logic to show a message or redirect the user to the sign-in page
        }
      } catch (error) {
        console.log("Error adding game to 'I played it' list:", error);
      }
    };

    const handleDelete = async ( game) => {
      
      try {
        if (user) {
          const collectionName = game.played ? "playedGames" : "wantToPlay";
          await deleteDoc(doc(collection(db, collectionName), game.id.toString()));
          console.log("Game deleted successfully!");

          const remainingGames = games.filter((g) => g.id !== game.id);
          setGames(remainingGames);

          if (remainingGames.length === 0 && currentPage > 1) {
            setCurrentPage((prevPage) => prevPage - 1);
          }

          setDisplayedGames((prevGames) => prevGames.filter((g) => g.id !== game.id));
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

    const isGamesSavedPage = window.location.pathname === "/games-saved";
  const isPlayedGamesPage = window.location.pathname === "/games-played";


    return(
        <div className="games-card-container">
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
                  <p className="text-xs">{game.released}</p>
                </div>
                <div className="game-genres">
                  <p>Genres:</p>
                  <p className="text-xs"> {game.genres.map((genre) => genre.name).join(", ")}</p>
                </div>
                <button className="more-info-btn">More Info</button>
              </div>
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
          
              
                <button className="remove-btn" onClick={() => handleDelete(game)}>
                  Remove
                </button>
              
            </div>
          </div>
        ))}

        <div className="page-container page-bottom">
          <button
            className="prev-page"
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
          >
            Previous Page
          </button>
          <p>-</p>
          <button
            className="next-page"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            Next Page
          </button>
        </div>
      </div>
    )
}