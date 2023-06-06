import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../App";
import { getDocs, collection } from "firebase/firestore";
import GameCard from "./GameCard";
import { db } from "../../firebase";

export default function GamesPlayed() {
  
  const {games, setGames, signedIn} = useContext(AuthContext)
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    // Fetch the games from the "playedGames" collection in Firestore
    const fetchPlayedGames = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "playedGames"));
        const playedGames = querySnapshot.docs.map((doc) => doc.data().game);
        setGames(playedGames);
        console.log(playedGames);
      } catch (error) {
        console.log("Error fetching played games:", error);
      }
    };

    fetchPlayedGames();
  }, []);

  useEffect(() => {
    const calculatedTotalPages = Math.ceil(games.length / 3);
    setTotalPages(calculatedTotalPages);
  }, [games]);

  return (
    <div>
      {signedIn ? 
      <div>
        
          <h1 className="game-list-title">Games You've' Conquered</h1>
          <GameCard
              games={games}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalPages={totalPages}
              setTotalPages={setTotalPages}
          />
        
      </div>
    : <p className="sign-in-list">Sign in to view your list</p>}
    </div>
  );
}
