import React, { useState, useEffect, useContext, useCallback } from "react";
import { AuthContext } from "../App";
import firebaseApp from "../../firebase";
import { getFirestore } from "firebase/firestore";
import GameCard from "./GameCard";
import Navbar from "./Navbar";

const db = getFirestore(firebaseApp);

export default function GetGames() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [gamesPerPage] = useState(3);

  const { loading, setLoading, games, setGames, search, apiKey } = useContext(AuthContext);

  const fetchGames = useCallback(
    async (page) => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://api.rawg.io/api/games?key=${apiKey}&search=${search}&page=${page}`
        );
        const data = await response.json();
        console.log(data.results);
        setGames(data.results);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    },
    [apiKey, search, setGames, setLoading]
  );

  useEffect(() => {
    const fetchTotalGames = async () => {
      try {
        const response = await fetch(
          `https://api.rawg.io/api/games?key=${apiKey}&search=${search}`
        );
        const data = await response.json();
        console.log(data.results);
        const totalGames = data.count;
        console.log("Total Games:", totalGames);
        const calculatedTotalPages = Math.ceil(totalGames / gamesPerPage);
        console.log("Calculated Total Pages:", calculatedTotalPages);
        setTotalPages(calculatedTotalPages);
      } catch (error) {
        console.log(error);
      }
    };

    fetchTotalGames();
  }, [search, apiKey, gamesPerPage, setTotalPages]);

  useEffect(() => {
    fetchGames(currentPage);
  }, [currentPage, fetchGames]);

  return (
    <div>
      
      <div>
        {loading ? (
          <div className="loading-container">
            <h1 className="loading-text animate-loading"></h1>
            <img className="loading w-screen" src="images/loading.gif" alt="loading" />
          </div>
        ) : (
          <div>
            <h1 className="results-title">Results for "{search}"</h1>
            <GameCard
              games={games}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalPages={totalPages}
              setTotalPages={setTotalPages}
              loading={loading}
              setLoading={setLoading}
            />
          </div>
        )}
      </div>
    </div>
  );
}
