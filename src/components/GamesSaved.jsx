import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../App";
import { getDocs, collection } from "firebase/firestore";
import GameCard from "./GameCard";
import { db } from "../../firebase";

export default function GamesSaved() {
  const { games, setGames } = useContext(AuthContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    // Fetch the games from the "wantToPlay" collection in Firestore
    const fetchWantToPlayGames = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "wantToPlay"));
        const wantToPlayGames = querySnapshot.docs.map((doc) => doc.data().game);
        setGames(wantToPlayGames);
        console.log(wantToPlayGames);
      } catch (error) {
        console.log("Error fetching played games:", error);
      }
    };

    fetchWantToPlayGames();
  }, []);

  useEffect(() => {
    const calculatedTotalPages = Math.ceil(games.length / 3);
    setTotalPages(calculatedTotalPages);
  }, [games]);

  return (
    <div>
      <h1 className="game-list-title">Games You Haven't Played</h1>
      <GameCard
        games={games}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
        setTotalPages={setTotalPages}
      />
    </div>
  );
};


