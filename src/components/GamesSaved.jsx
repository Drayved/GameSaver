import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../App";
import { getDocs, collection, doc } from "firebase/firestore";
import GameCard from "./GameCard";
import { db } from "../../firebase";


export default function GamesSaved() {
  const { games, setGames, signedIn, user } = useContext(AuthContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [wantToPlay, setWantToPlay] = useState([])

  useEffect(() => {
    // Fetch the games from the "wantToPlay" collection in Firestore
    const fetchWantToPlayGames = async () => {
      try {
        
        if (user) {
          const userDocRef = doc(db, "users", user.uid);
          const wantToPlayQuerySnapshot = await getDocs(collection(userDocRef, "wantToPlay"));
          const wantToPlayGames = wantToPlayQuerySnapshot.docs.map((doc) => doc.data());
          setWantToPlay(wantToPlayGames)
          
          setGames(wantToPlayGames);
          console.log("wantToPlayGames:", wantToPlayGames);
          console.log(wantToPlayGames);
        }
      } catch (error) {
        console.log("Error fetching games:", error);
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
      {signedIn ? 
      <div>
        <h1 className="game-list-title">{games.length > 0 ? "Games You Haven't Played" : "You haven't added any games to this list"}</h1>
        <GameCard
          games={games}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
          setTotalPages={setTotalPages}
          wantToPlay={wantToPlay}
        />
      </div>
      : <p className="sign-in-list">Sign in to view your list</p>}
    </div>
  );
};


