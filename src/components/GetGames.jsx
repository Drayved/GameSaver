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


  const { loading, setLoading, games, setGames, search, selectedGenre } = useContext(AuthContext);

  const apiKey = import.meta.env.VITE_RAWG_KEY
  

  const fetchGames = useCallback(async (page) => {
    try {
      setLoading(true);
      const apiUrl = 'http://localhost:8888/.netlify/functions/getGames';
      const requestBody = {
        search,
        selectedGenre,
        page,
      };
      const response = await fetch(apiUrl, {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });
      const data = await response.json();
      console.log(data)
      setGames(data.results);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }, [setGames, selectedGenre, search]);

  useEffect(() => {
    const fetchTotalGames = async () => {
      try {
        const response = await fetch(
          'http://localhost:8888/.netlify/functions/getGames',
          {
            method: 'POST',
            body: JSON.stringify({ search, selectedGenre }),
          }
        );
        const data = await response.json();

        const totalGames = data.count;

        const calculatedTotalPages = Math.ceil(totalGames / gamesPerPage);

        setTotalPages(calculatedTotalPages);
      } catch (error) {
        console.log(error);
      }
    };

    fetchTotalGames();
  }, [search, apiKey, gamesPerPage, setTotalPages]);

  useEffect(() => {
    fetchGames(currentPage);
  }, [currentPage, selectedGenre]);

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
            <h1 className="results-title">Results for "{search ? search : selectedGenre}"</h1>
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
