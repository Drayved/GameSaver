import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../App";
import firebaseApp from "../../firebase"; // Assuming you've exported the initialized Firebase app as `firebaseApp`
import { getFirestore, collection, doc, setDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import GameCard from "./GameCard";

const db = getFirestore(firebaseApp);

export default function GetGames() {
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [gamesPerPage] = useState(3);
  const apiKey = "10cab07048cb4f6591685d4bf79954bd";
  const { games, setGames, search } = useContext(AuthContext)

  const fetchGames = async (page) => {
    try {
      const response = await fetch(
        `https://api.rawg.io/api/games?key=${apiKey}&page=${page}&search=${search}`
      );
      const data = await response.json();
      setGames(data.results);
      setLoading(false)
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
  }, [currentPage, search]);


  
  return (
    <div >
      {loading ? 
      <h1 className="loading">Loading...</h1>
    :
    <div>
      <h1 className="results-title">Results for "{search}"</h1>
      <GameCard 
        games={games} 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage} 
        totalPages={totalPages}
        setTotalPages={setTotalPages}
      />
    </div>
    }
    </div>
  );
}

