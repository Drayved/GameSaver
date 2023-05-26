import React, { useState, useEffect } from "react";
import { AuthContext } from "../App";

export default function GetGames() {
  const [games, setGames] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [gamesPerPage] = useState(3);
  const apiKey = "10cab07048cb4f6591685d4bf79954bd";

  const fetchGames = async (page) => {
    try {
      const response = await fetch(
        `https://api.rawg.io/api/games?key=${apiKey}&page=${page}`
      );
      const data = await response.json();
      setGames(data.results);
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
        console.log(data.results)
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

  const displayedGames = games.slice(0,3)

  return (
    <div>
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
                <p>{game.released}</p>
                <p> {game.genres.map((genre) => genre.name).join(", ")}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="page-container">
        <button onClick={handlePreviousPage} disabled={currentPage === 1}>
          Previous Page
        </button>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>
          Next Page
        </button>
      </div>
    </div>
  );
}
