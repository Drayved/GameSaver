import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../App";
import { getDocs, collection, doc } from "firebase/firestore";
import GameCard from "./GameCard";
import { db } from "../../firebase";


export default function GamesSaved() {
  const { games, setGames, signedIn, user } = useContext(AuthContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchPlayedGames = async () => {
      try {
        
        if (user) {
          const userDocRef = doc(db, "users", user.uid);
          const playedGamesQuerySnapshot = await getDocs(collection(userDocRef, "playedGames"));
          const playedGames = playedGamesQuerySnapshot.docs.map((doc) => {
            console.log("Document:", doc);
            console.log("Document data:", doc.data());
            return doc.data();
          });
          console.log("playedGames:", playedGames);
          setGames(playedGames);
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
          />
        </div>
      ) : (
        <p className="sign-in-list">Sign in to view your list</p>
      )}
    </div>
  );
}
