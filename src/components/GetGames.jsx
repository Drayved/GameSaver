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
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const apiUrl = 'http://localhost:8888/.netlify/functions/getGames';
        
        const requestBody = {
          search,
          selectedGenre,
        };
        
        const [totalGamesResponse, gamesResponse] = await Promise.all([
          fetch(apiUrl, {
            method: 'POST',
            body: JSON.stringify(requestBody),
          }),
          fetch(apiUrl, {
            method: 'POST',
            body: JSON.stringify({ ...requestBody, page: currentPage }),
          }),
        ]);
        
        const [totalGamesData, gamesData] = await Promise.all([
          totalGamesResponse.json(),
          gamesResponse.json(),
        ]);
  
        const totalGames = totalGamesData.count;
        const calculatedTotalPages = Math.ceil(totalGames / gamesPerPage);
  
        setTotalPages(calculatedTotalPages);
        setGames(gamesData.results);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
  
    fetchData();
  }, [search, selectedGenre, currentPage, gamesPerPage, setTotalPages, setGames]);

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
