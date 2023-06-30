import React, { useState, useEffect, useContext, useCallback } from "react";
import { AuthContext } from "../App";
import firebaseApp from "../../firebase";
import { getFirestore } from "firebase/firestore";
import GameCard from "./GameCard";
import Navbar from "./Navbar";

const db = getFirestore(firebaseApp);

export default function GetGames() {
  const storedSearchQuery = localStorage.getItem("search") || ""
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [gamesPerPage] = useState(3);

  const { loading, setLoading, games, setGames, search, selectedGenre } = useContext(AuthContext);

  

  const fetchGames = useCallback(async () => {
    try {
      setLoading(true);
      let apiUrl = `https://davids-gamesaver.netlify.app/.netlify/functions/fetchGames?`;

      if (storedSearchQuery) {
        apiUrl += `&search=${storedSearchQuery}`; // Use the stored search query if it exists
      }else if (search) {
        apiUrl += `&search=${search}`;
      }
      

      if (selectedGenre) {
        apiUrl += `&genres=${selectedGenre}`;
        setCurrentPage(1);
      }

      const response = await fetch(apiUrl);
      const data = await response.json();
      console.log(data)
      const totalGames = data.count;
      const calculatedTotalPages = Math.ceil(totalGames / gamesPerPage);

      setTotalPages(calculatedTotalPages);
      setGames(data.results);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }, [ search, selectedGenre]);

  useEffect(() => {
    fetchGames();
  }, [fetchGames]);



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
            <h1 className="results-title">Results for "{storedSearchQuery || search || selectedGenre}"</h1>
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
