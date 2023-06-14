import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../App";
import { getDocs, collection, doc } from "firebase/firestore";
import GameCard from "./GameCard";
import { db } from "../../firebase";


export default function GamesSaved() {
  const { games, setGames, signedIn, user } = useContext(AuthContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [playedGames, setPlayedGames] = useState([]);

  useEffect(() => {
    const fetchPlayedGames = async () => {
      try {
        
        if (user) {
          const userDocRef = doc(db, "users", user.uid);
          const playedGamesQuerySnapshot = await getDocs(collection(userDocRef, "playedGames"));
          const playedGamesData = playedGamesQuerySnapshot.docs.map((doc) => doc.data());
          setPlayedGames(playedGamesData)
          
          setGames(playedGamesData);
          console.log("playedGames:", playedGames);
          console.log(playedGames);
        }
      } catch (error) {
        console.log("Error fetching games:", error);
      }
    };

    

    fetchPlayedGames();
  }, []);

  useEffect(() => {
    const calculatedTotalPages = Math.ceil(games.length / 3);
    setTotalPages(calculatedTotalPages);
  }, [games]);
console.log(playedGames)
  return (
    <div>
      {signedIn ? (
        <div>
          <h1 className="game-list-title">
            {games.length > 0
              ? "Games You've Conquered"
              : "You haven't added any games to this list"}
          </h1>
          <GameCard
            games={games}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
            setTotalPages={setTotalPages}
            playedGames={playedGames}
          />
        </div>
      ) : (
        <p className="sign-in-list">Sign in to view your list</p>
      )}
    </div>
  );
}
