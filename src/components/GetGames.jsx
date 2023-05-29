import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../App";
import firebaseApp from "../../firebase"; // Assuming you've exported the initialized Firebase app as `firebaseApp`
import { getFirestore, collection, doc, setDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

const db = getFirestore(firebaseApp);

export default function GetGames() {
  const [games, setGames] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [gamesPerPage] = useState(3);
  const apiKey = "10cab07048cb4f6591685d4bf79954bd";
  const {user, setUser} = useContext(AuthContext)

  const fetchGames = async (page) => {
    try {
      const response = await fetch(
        `https://api.rawg.io/api/games?key=${apiKey}&page=${page}`
      );
      const data = await response.json();
      setGames(data.results);
      console.log(user)
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchTotalGames = async () => {
      try {
        const response = await fetch(
          `https://api.rawg.io/api/games?key=${apiKey}`
        );
        const data = await response.json();
        console.log(data.results);
        const totalGames = data.count;
        const calculatedTotalPages = Math.ceil(totalGames / gamesPerPage);
        setTotalPages(calculatedTotalPages);
      } catch (error) {
        console.log(error);
      }
    };

    fetchTotalGames();
  }, []);

  useEffect(() => {
    fetchGames(currentPage);
  }, [currentPage]);

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

  const displayedGames = games.slice(0, 3);

  return (
    <div >
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
              <button
                onClick={(event) => handleWantToPlay(event, game)}
                className="want-btn"
              >
                I want to play it
              </button>
              <button
                onClick={(event) => handlePlayedIt(event, game)}
                className="played-btn"
              >
                I played it
              </button>
            </div>
          </div>
        ))}
      </div>

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
  );
}

